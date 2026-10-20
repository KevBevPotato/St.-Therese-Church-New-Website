import { useEffect, useState } from 'react';
import { Link, useLocation } from 'wouter';
import Header from '../components/Header';
import Footer from '../components/Footer';
import {
    staticEvents,
    generateRecurringEventsForMonth,
    getLatestRecurringScheduleEndDate,
} from '../components/eventfolders/events';
import { EventCard } from '../components/event-components';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { submitForm } from '@/lib/submit-form';
import { useSubmissionReview } from '@/hooks/use-submission-review';
import {
    BookOpen,
    X,
    FileText,
    Heart,
    ArrowRight,
} from 'lucide-react';
import {
    faithCategories,
    faithFormationSettings,
    type FaithCategory,
    type FaithGroup,
} from '../data/faith-formation';

const FAITH_FORMATION_DONATION_URL =
    'https://secure.myvanco.com/L-ZAYT/campaign/C-10ACK';

/**
 * Faith Formation Landing Page
 */

type FormSacraments = {
    baptism: boolean;
    reconciliation: boolean;
    eucharist: boolean;
    confirmation: boolean;
};

interface ChildData {
    firstName: string;
    lastName: string;
    grade: string;
    dateOfBirth: string;
    school: string;
    emergencyContactGuardianFirstName: string;
    sacraments: FormSacraments;
}

interface ParentData {
    firstName: string;
    lastName: string;
    relationship: string;
    otherRelationship: string;
    cell: string;
    religion: string;
    email: string;
}

interface FormData {
    numberOfChildren: number;
    children: ChildData[];
    sameEmergencyContact: boolean;
    parent1: ParentData;
    parent2: ParentData;
    hasSecondParent: boolean;
    parent2DifferentAddress: boolean;
    streetAddress: string;
    city: string;
    zipCode: string;
    isMember: string;
    parent2StreetAddress: string;
    parent2City: string;
    parent2ZipCode: string;
}

type GroupFilter = FaithGroup | 'all';

const groupFilters: { id: GroupFilter; label: string }[] = [
    { id: 'all', label: 'All Programs' },
    { id: 'elementary', label: 'Elementary' },
    { id: 'middle-school', label: 'Middle School' },
    { id: 'high-school', label: 'High School' },
    { id: 'adult', label: 'Adult' },
];

const createDefaultChildData = (): ChildData => ({
    firstName: '',
    lastName: '',
    grade: '',
    dateOfBirth: '',
    school: '',
    emergencyContactGuardianFirstName: '',
    sacraments: {
        baptism: false,
        reconciliation: false,
        eucharist: false,
        confirmation: false,
    },
});

const createDefaultParentData = (): ParentData => ({
    firstName: '',
    lastName: '',
    relationship: '',
    otherRelationship: '',
    cell: '',
    religion: '',
    email: '',
});

const createDefaultFormData = (): FormData => ({
    numberOfChildren: 1,
    children: [createDefaultChildData()],
    sameEmergencyContact: false,
    parent1: createDefaultParentData(),
    parent2: createDefaultParentData(),
    hasSecondParent: false,
    parent2DifferentAddress: false,
    streetAddress: '',
    city: '',
    zipCode: '',
    isMember: '',
    parent2StreetAddress: '',
    parent2City: '',
    parent2ZipCode: '',
});

export default function FaithFormation() {
    const [, navigate] = useLocation();
    const [selectedGroups, setSelectedGroups] = useState<Set<GroupFilter>>(new Set<GroupFilter>(['all']));
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [registrationSuccessTuition, setRegistrationSuccessTuition] = useState<number | null>(null);
    const { reviewSubmission, reviewDialog } = useSubmissionReview();
    const [formData, setFormData] = useState<FormData>(createDefaultFormData);

    useEffect(() => {
        if (window.location.hash === '#register') {
            setIsFormOpen(true);
        }
    }, []);

    const closeRegistrationForm = () => {
        setIsFormOpen(false);
        if (window.location.hash === '#register') {
            window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}`);
        }
    };

    const toggleGroup = (id: GroupFilter) => {
        const next = new Set(selectedGroups);
        if (id === 'all') {
            setSelectedGroups(new Set<GroupFilter>(['all']));
            return;
        }
        if (next.has('all')) next.delete('all');
        if (next.has(id)) {
            next.delete(id);
            if (next.size === 0) next.add('all');
        } else {
            next.add(id);
        }
        setSelectedGroups(next);
    };

    const deselectAll = () => setSelectedGroups(new Set());

    const filtered = faithCategories.filter((cat) => {
        if (selectedGroups.has('all')) return true;
        if (selectedGroups.size === 0) return false;
        return selectedGroups.has(cat.group);
    });

    const upcomingFaithFormationEvents = (() => {
        const now = new Date();
        const lastScheduleDate = getLatestRecurringScheduleEndDate('faith-formation');
        const allEvents = [...staticEvents];

        if (lastScheduleDate) {
            const month = new Date(now.getFullYear(), now.getMonth(), 1);
            const lastMonth = new Date(
                lastScheduleDate.getFullYear(),
                lastScheduleDate.getMonth(),
                1
            );

            while (month <= lastMonth) {
                allEvents.push(
                    ...generateRecurringEventsForMonth(
                        month.getMonth(),
                        month.getFullYear()
                    )
                );
                month.setMonth(month.getMonth() + 1);
            }
        }

        return allEvents
            .filter((event) => {
                if (event.date < now) return false;
                const title = event.title.toLowerCase();
                return (
                    title.includes('family formation') ||
                    title.includes('faith formation') ||
                    event.organizationTags?.includes('faith-formation') ||
                    event.linkedOpportunityId === 'wednesday-night-supper'
                );
            })
            .sort((a, b) => a.date.getTime() - b.date.getTime());
    })();

    const tuitionCost = Math.min(
        formData.numberOfChildren * 25,
        formData.isMember === 'Yes' ? 50 : 75,
    );

    const handleNumberOfChildrenChange = (num: number) => {
        const newChildren = [...formData.children];
        if (num > formData.numberOfChildren) {
            for (let i = formData.numberOfChildren; i < num; i++) {
                newChildren.push(createDefaultChildData());
            }
        } else {
            newChildren.splice(num);
        }
        setFormData((prev) => ({
            ...prev,
            numberOfChildren: num,
            children: newChildren,
            sameEmergencyContact: num > 1 ? prev.sameEmergencyContact : false,
        }));
    };

    const handleChildTextChange = (
        childIndex: number,
        field: Exclude<keyof ChildData, 'sacraments'>,
        value: string,
    ) => {
        setFormData((previous) => ({
            ...previous,
            children: previous.children.map((child, index) => {
                if (index === childIndex || (previous.sameEmergencyContact && field.startsWith('emergencyContact'))) {
                    return { ...child, [field]: value };
                }
                return child;
            }),
        }));
    };

    const handleParentChange = (
        parent: 'parent1' | 'parent2',
        field: keyof ParentData,
        value: string,
    ) => {
        setFormData((previous) => ({
            ...previous,
            [parent]: { ...previous[parent], [field]: value },
        }));
    };

    const handleSameEmergencyContactChange = (checked: boolean) => {
        setFormData((previous) => {
            if (!checked) return { ...previous, sameEmergencyContact: false };
            const emergencyContactGuardianFirstName =
                previous.children[0].emergencyContactGuardianFirstName;
            const children = previous.children.map((child) => ({
                ...child,
                emergencyContactGuardianFirstName,
            }));
            return { ...previous, sameEmergencyContact: true, children };
        });
    };

    const handleSecondParentChange = (hasSecondParent: boolean) => {
        setFormData((previous) => ({ ...previous, hasSecondParent }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (formData.children.some((child) => !child.emergencyContactGuardianFirstName.trim())) {
            window.alert('Please enter an emergency contact guardian first name for each child.');
            return;
        }
        const payload: Record<string, string> = {
            number_of_children: String(formData.numberOfChildren),
            same_emergency_contact: String(formData.sameEmergencyContact),
            has_second_parent: String(formData.hasSecondParent),
            parent_2_different_address: String(formData.parent2DifferentAddress),
            street_address: formData.streetAddress.trim(),
            city: formData.city.trim(),
            zip_code: formData.zipCode.trim(),
            is_member: formData.isMember,
            parent_2_street_address: formData.parent2DifferentAddress ? formData.parent2StreetAddress.trim() : '',
            parent_2_city: formData.parent2DifferentAddress ? formData.parent2City.trim() : '',
            parent_2_zip_code: formData.parent2DifferentAddress ? formData.parent2ZipCode.trim() : '',
        };
        [formData.parent1, formData.parent2].forEach((parent, index) => {
            const prefix = `parent_${index + 1}_`;
            payload[`${prefix}first_name`] = parent.firstName.trim();
            payload[`${prefix}last_name`] = parent.lastName.trim();
            payload[`${prefix}relationship`] = parent.relationship;
            payload[`${prefix}other_relationship`] = parent.relationship === 'Other'
                ? parent.otherRelationship.trim()
                : '';
            payload[`${prefix}cell`] = parent.cell.trim();
            payload[`${prefix}religion`] = parent.religion.trim();
            payload[`${prefix}email`] = parent.email.trim();
        });
        formData.children.forEach((child, index) => {
            const prefix = `child_${index + 1}_`;
            payload[`${prefix}first_name`] = child.firstName.trim();
            payload[`${prefix}last_name`] = child.lastName.trim();
            payload[`${prefix}grade`] = child.grade.trim();
            payload[`${prefix}date_of_birth`] = child.dateOfBirth;
            payload[`${prefix}school`] = child.school.trim();
            payload[`${prefix}emergency_contact_guardian_first_name`] = child.emergencyContactGuardianFirstName.trim();
            payload[`${prefix}sacraments_received`] = Object.entries(child.sacraments)
                .filter(([, received]) => received)
                .map(([sacrament]) => sacrament)
                .join(', ');
        });

        reviewSubmission('Faith Formation Registration', {
            ...payload,
            tuition_owed: `$${tuitionCost}`,
        }, async () => {
            setIsSubmitting(true);
            try {
                await submitForm('faith_formation_registration', payload);
                setRegistrationSuccessTuition(tuitionCost);
                setIsSubmitting(false);
                setIsFormOpen(false);
                setFormData(createDefaultFormData());
            } catch (error) {
                console.error('Faith Formation registration failed:', error);
                alert(
                    error instanceof Error
                        ? error.message
                        : 'We could not submit your registration. Please try again.'
                );
                setIsSubmitting(false);
            }
        });
    };

    return (
        <div className="min-h-screen flex flex-col bg-[#fbfaf6]">
            <Header donateUrl={FAITH_FORMATION_DONATION_URL} />
            <div className="pt-[69px]" />

            <section className="relative overflow-hidden border-b border-primary/10 bg-[#fbfaf6] py-16 md:py-20">
                <div className="absolute -right-20 -top-24 size-80 rounded-full bg-[#b8954f]/10 blur-3xl" aria-hidden="true" />
                <div className="container relative grid gap-10 md:grid-cols-[1.18fr_0.82fr] md:items-end mx-auto px-4">
                    <div>
                        <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-[#9b762f]">
                            <BookOpen className="size-4" aria-hidden="true" /> Growing in Faith
                        </p>
                        <h1 className="mt-4 max-w-3xl font-serif text-5xl font-bold leading-[0.98] text-primary md:text-7xl">
                            {faithFormationSettings.pageTitle}
                        </h1>
                        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
                            {faithFormationSettings.introduction}
                        </p>
                        <div className="mt-6 max-w-xl rounded-2xl border border-primary/10 bg-white/80 p-4 shadow-sm backdrop-blur-sm">
                            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#9b762f]">Wednesday Evening Schedule</p>
                            <div className="mt-3 flex flex-wrap gap-6 text-sm font-semibold text-primary">
                                <span>Meal: {faithFormationSettings.mealTime}</span>
                                <span>Classes: {faithFormationSettings.classTime}</span>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-4 mt-8">
                            {faithFormationSettings.showRegistrationButton !== false &&
                                (faithFormationSettings.registrationUrl || faithFormationSettings.registrationFlyer ? (
                                    <a
                                        href={faithFormationSettings.registrationUrl || faithFormationSettings.registrationFlyer}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center rounded-md bg-accent px-8 py-6 font-bold uppercase tracking-widest text-white shadow-lg transition-colors hover:bg-accent/90"
                                    >
                                        {faithFormationSettings.registrationLabel || "Register Here"}
                                    </a>
                                ) : (
                                    <Button
                                        onClick={() => setIsFormOpen(true)}
                                        size="lg"
                                        className="bg-accent hover:bg-accent/90 text-white px-8 py-6 font-bold uppercase tracking-widest shadow-lg"
                                    >
                                        {faithFormationSettings.registrationLabel || "Register Here"}
                                    </Button>
                                ))}
                            {faithFormationSettings.showSignupButton !== false &&
                                (faithFormationSettings.signupUrl || faithFormationSettings.signupFlyer) && (
                                <a
                                    href={faithFormationSettings.signupUrl || faithFormationSettings.signupFlyer}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 bg-white text-accent border-2 border-accent hover:bg-accent/10 px-8 py-2 font-bold uppercase tracking-widest shadow-lg transition-all rounded-md"
                                >
                                    {faithFormationSettings.signupLabel}
                                </a>
                            )}
                            {faithFormationSettings.showClassroomMapButton !== false &&
                                (faithFormationSettings.classroomMapUrl || faithFormationSettings.classroomMapFlyer) && (
                                <a
                                    href={faithFormationSettings.classroomMapUrl || faithFormationSettings.classroomMapFlyer}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 bg-white text-accent border-2 border-accent hover:bg-accent/10 px-8 py-2 font-bold uppercase tracking-widest shadow-lg transition-all rounded-md"
                                >
                                    <FileText size={18} /> {faithFormationSettings.classroomMapLabel}
                                </a>
                            )}
                        </div>
                    </div>
                    <aside className="flex flex-col gap-5 pl-6 md:mb-1">
                        {upcomingFaithFormationEvents.length > 0 && (
                            <div className="rounded-3xl border border-primary/10 bg-white/80 p-4 shadow-sm backdrop-blur-sm">
                                <div className="mb-4 flex items-center justify-between gap-3 border-b border-primary/10 pb-3">
                                    <div>
                                        <h2 className="mt-1 font-serif text-2xl font-bold text-primary">
                                            Upcoming Formation Nights
                                        </h2>
                                    </div>
                                </div>
                                <div className="max-h-[460px] space-y-3 overflow-y-auto pr-1">
                                    {upcomingFaithFormationEvents.map((event) => (
                                        <EventCard
                                            key={event.id}
                                            event={event}
                                            highlighted={false}
                                            navigate={navigate}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </aside>
                </div>
            </section>

            <main className="flex-grow py-12">
                <div className="container mx-auto px-4">
                    <div className="mb-12">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                            <h2 className="font-serif text-3xl font-bold text-primary">Explore Our Programs</h2>
                        </div>
                        <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                            <button
                                onClick={() => toggleGroup('all')}
                                className={`px-6 py-3 rounded-full font-bold uppercase tracking-widest text-xs transition-all border-2 ${selectedGroups.has('all')
                                    ? 'bg-primary border-primary text-white shadow-lg'
                                    : 'bg-white border-primary/10 text-primary hover:border-primary/30'
                                    }`}
                            >
                                All Programs
                            </button>
                            {groupFilters
                                .filter((g) => g.id !== 'all')
                                .map((g) => (
                                    <button
                                        key={g.id}
                                        onClick={() => toggleGroup(g.id as FaithGroup)}
                                        className={`px-6 py-3 rounded-full font-bold uppercase tracking-widest text-xs transition-all border-2 ${selectedGroups.has(g.id)
                                            ? 'bg-primary border-primary text-white shadow-lg'
                                            : 'bg-white border-primary/10 text-primary hover:border-primary/30'
                                            }`}
                                    >
                                        {g.label}
                                    </button>
                                ))}
                            <button
                                onClick={deselectAll}
                                className="text-xs font-bold text-primary/40 hover:text-accent uppercase tracking-widest transition-colors"
                            >
                                Deselect All
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8">
                        {filtered.map((cat) => (
                            <CategoryCard key={cat.id} category={cat} />
                        ))}
                    </div>

                    {filtered.length === 0 && (
                        <div className="text-center py-24 bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200">
                            <BookOpen className="size-12 text-gray-200 mx-auto mb-4" />
                            <h3 className="text-xl font-serif font-bold text-primary mb-2">No programs selected</h3>
                            <p className="text-muted-foreground">Select a category above to view our faith formation offerings.</p>
                            <Button
                                variant="link"
                                onClick={() => setSelectedGroups(new Set<GroupFilter>(['all']))}
                                className="mt-4 text-accent font-bold"
                            >
                                View All Programs
                            </Button>
                        </div>
                    )}
                </div>
            </main>

            {isFormOpen && (
                <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-primary/40 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl my-8 overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="bg-primary p-6 text-white flex justify-between items-center">
                            <div>
                                <h3 className="font-serif text-2xl font-bold">Program Registration</h3>
                                <p className="text-xs text-white/70 uppercase tracking-widest mt-1">Faith Formation 2026-2027</p>
                            </div>
                            <button
                                onClick={closeRegistrationForm}
                                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                                aria-label="Close registration form"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <form
                            className="p-8 space-y-8 max-h-[80vh] overflow-y-auto custom-scrollbar"
                            onSubmit={handleSubmit}
                        >
                            <div className="bg-accent/5 p-6 rounded-2xl border border-accent/10">
                                <h4 className="font-bold text-primary mb-2 flex items-center gap-2">
                                    <Heart size={18} className="text-accent" /> Registration Information
                                </h4>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    Please fill out the form below to register your children for our Faith Formation programs. {faithFormationSettings.classNote}
                                </p>
                            </div>

                            <section className="space-y-5">
                                <div className="space-y-2">
                                    <label htmlFor="numberOfChildren" className="text-xs font-bold text-primary uppercase tracking-widest">
                                        How many children?
                                    </label>
                                    <select
                                        id="numberOfChildren"
                                        value={formData.numberOfChildren}
                                        onChange={(event) => handleNumberOfChildrenChange(Number(event.target.value))}
                                        className="w-full rounded-xl border-2 border-gray-100 px-4 py-3 outline-none focus:border-primary"
                                    >
                                        {Array.from({ length: 12 }, (_, index) => index + 1).map((number) => (
                                            <option key={number} value={number}>
                                                {number} {number === 1 ? 'Child' : 'Children'}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <section className="space-y-5 border-t border-gray-100 pt-8">
                                    <h4 className="font-bold text-primary uppercase tracking-widest text-sm">Guardian 1</h4>
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <label className="space-y-2 text-sm font-medium text-primary">
                                            First name
                                            <input required type="text" value={formData.parent1.firstName} onChange={(event) => handleParentChange('parent1', 'firstName', event.target.value)} className="w-full rounded-xl border-2 border-gray-100 px-4 py-3 outline-none focus:border-primary" />
                                        </label>
                                        <label className="space-y-2 text-sm font-medium text-primary">
                                            Last name
                                            <input required type="text" value={formData.parent1.lastName} onChange={(event) => handleParentChange('parent1', 'lastName', event.target.value)} className="w-full rounded-xl border-2 border-gray-100 px-4 py-3 outline-none focus:border-primary" />
                                        </label>
                                        <label className="space-y-2 text-sm font-medium text-primary">
                                            Relationship to child
                                            <select required value={formData.parent1.relationship} onChange={(event) => handleParentChange('parent1', 'relationship', event.target.value)} className="w-full rounded-xl border-2 border-gray-100 px-4 py-3 outline-none focus:border-primary">
                                                <option value="">Select relationship</option>
                                                <option>Father</option>
                                                <option>Mother</option>
                                                <option>Other</option>
                                            </select>
                                        </label>
                                        {formData.parent1.relationship === 'Other' && (
                                            <label className="space-y-2 text-sm font-medium text-primary">
                                                Please specify relationship
                                                <input required type="text" value={formData.parent1.otherRelationship} onChange={(event) => handleParentChange('parent1', 'otherRelationship', event.target.value)} className="w-full rounded-xl border-2 border-gray-100 px-4 py-3 outline-none focus:border-primary" />
                                            </label>
                                        )}
                                        <fieldset className="space-y-2">
                                            <legend className="text-sm font-medium text-primary">Member at St. Thérèse?</legend>
                                            <div className="flex gap-4">
                                                {['Yes', 'No'].map((answer) => (
                                                    <label key={answer} className="flex items-center gap-2 text-sm text-muted-foreground">
                                                        <input required type="radio" name="isMember" value={answer} checked={formData.isMember === answer} onChange={(event) => setFormData((previous) => ({ ...previous, isMember: event.target.value }))} className="accent-primary" />
                                                        {answer}
                                                    </label>
                                                ))}
                                            </div>
                                        </fieldset>
                                        <label className="space-y-2 text-sm font-medium text-primary">
                                            Cell
                                            <input required type="tel" autoComplete="tel" value={formData.parent1.cell} onChange={(event) => handleParentChange('parent1', 'cell', event.target.value)} className="w-full rounded-xl border-2 border-gray-100 px-4 py-3 outline-none focus:border-primary" />
                                        </label>
                                        <label className="space-y-2 text-sm font-medium text-primary">
                                            Religion
                                            <input required type="text" value={formData.parent1.religion} onChange={(event) => handleParentChange('parent1', 'religion', event.target.value)} className="w-full rounded-xl border-2 border-gray-100 px-4 py-3 outline-none focus:border-primary" />
                                        </label>
                                        <label className="space-y-2 text-sm font-medium text-primary">
                                            Email
                                            <input required type="email" autoComplete="email" value={formData.parent1.email} onChange={(event) => handleParentChange('parent1', 'email', event.target.value)} className="w-full rounded-xl border-2 border-gray-100 px-4 py-3 outline-none focus:border-primary" />
                                        </label>
                                        <label className="space-y-2 text-sm font-medium text-primary md:col-span-2">
                                            Address
                                            <input required type="text" autoComplete="street-address" value={formData.streetAddress} onChange={(event) => setFormData((previous) => ({ ...previous, streetAddress: event.target.value }))} className="w-full rounded-xl border-2 border-gray-100 px-4 py-3 outline-none focus:border-primary" />
                                        </label>
                                        <label className="space-y-2 text-sm font-medium text-primary">
                                            City
                                            <input required type="text" autoComplete="address-level2" value={formData.city} onChange={(event) => setFormData((previous) => ({ ...previous, city: event.target.value }))} className="w-full rounded-xl border-2 border-gray-100 px-4 py-3 outline-none focus:border-primary" />
                                        </label>
                                        <label className="space-y-2 text-sm font-medium text-primary">
                                            Zipcode
                                            <input required type="text" autoComplete="postal-code" value={formData.zipCode} onChange={(event) => setFormData((previous) => ({ ...previous, zipCode: event.target.value }))} className="w-full rounded-xl border-2 border-gray-100 px-4 py-3 outline-none focus:border-primary" />
                                        </label>
                                    </div>

                                    <label className="flex items-center gap-2 text-sm text-primary">
                                        <input type="checkbox" checked={formData.hasSecondParent} onChange={(event) => handleSecondParentChange(event.target.checked)} className="accent-primary" />
                                        Add Guardian 2
                                    </label>

                                    {formData.hasSecondParent && (
                                        <div className="space-y-5 rounded-2xl border-2 border-gray-100 p-6">
                                            <h5 className="font-bold text-primary">Guardian 2</h5>
                                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                                <label className="space-y-2 text-sm font-medium text-primary">
                                                    First name
                                                    <input required type="text" value={formData.parent2.firstName} onChange={(event) => handleParentChange('parent2', 'firstName', event.target.value)} className="w-full rounded-xl border-2 border-gray-100 px-4 py-3 outline-none focus:border-primary" />
                                                </label>
                                                <label className="space-y-2 text-sm font-medium text-primary">
                                                    Last name
                                                    <input required type="text" value={formData.parent2.lastName} onChange={(event) => handleParentChange('parent2', 'lastName', event.target.value)} className="w-full rounded-xl border-2 border-gray-100 px-4 py-3 outline-none focus:border-primary" />
                                                </label>
                                                <label className="space-y-2 text-sm font-medium text-primary">
                                                    Relationship to child
                                                    <select required value={formData.parent2.relationship} onChange={(event) => handleParentChange('parent2', 'relationship', event.target.value)} className="w-full rounded-xl border-2 border-gray-100 px-4 py-3 outline-none focus:border-primary">
                                                        <option value="">Select relationship</option>
                                                        <option>Father</option>
                                                        <option>Mother</option>
                                                        <option>Other</option>
                                                    </select>
                                                </label>
                                                {formData.parent2.relationship === 'Other' && (
                                                    <label className="space-y-2 text-sm font-medium text-primary">
                                                        Please specify relationship
                                                        <input required type="text" value={formData.parent2.otherRelationship} onChange={(event) => handleParentChange('parent2', 'otherRelationship', event.target.value)} className="w-full rounded-xl border-2 border-gray-100 px-4 py-3 outline-none focus:border-primary" />
                                                    </label>
                                                )}
                                                <label className="space-y-2 text-sm font-medium text-primary">
                                                    Cell
                                                    <input required type="tel" value={formData.parent2.cell} onChange={(event) => handleParentChange('parent2', 'cell', event.target.value)} className="w-full rounded-xl border-2 border-gray-100 px-4 py-3 outline-none focus:border-primary" />
                                                </label>
                                                <label className="space-y-2 text-sm font-medium text-primary">
                                                    Religion
                                                    <input required type="text" value={formData.parent2.religion} onChange={(event) => handleParentChange('parent2', 'religion', event.target.value)} className="w-full rounded-xl border-2 border-gray-100 px-4 py-3 outline-none focus:border-primary" />
                                                </label>
                                                <label className="space-y-2 text-sm font-medium text-primary md:col-span-2">
                                                    Email
                                                    <input required type="email" value={formData.parent2.email} onChange={(event) => handleParentChange('parent2', 'email', event.target.value)} className="w-full rounded-xl border-2 border-gray-100 px-4 py-3 outline-none focus:border-primary" />
                                                </label>
                                            </div>
                                            <label className="flex items-center gap-2 text-sm text-primary">
                                                <input type="checkbox" checked={formData.parent2DifferentAddress} onChange={(event) => setFormData((previous) => ({ ...previous, parent2DifferentAddress: event.target.checked }))} className="accent-primary" />
                                                Guardians live separately — enter Guardian 2&apos;s address
                                            </label>
                                            {formData.parent2DifferentAddress && (
                                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                                    <label className="space-y-2 text-sm font-medium text-primary md:col-span-2">
                                                        Address
                                                        <input required type="text" value={formData.parent2StreetAddress} onChange={(event) => setFormData((previous) => ({ ...previous, parent2StreetAddress: event.target.value }))} className="w-full rounded-xl border-2 border-gray-100 px-4 py-3 outline-none focus:border-primary" />
                                                    </label>
                                                    <label className="space-y-2 text-sm font-medium text-primary">
                                                        City
                                                        <input required type="text" value={formData.parent2City} onChange={(event) => setFormData((previous) => ({ ...previous, parent2City: event.target.value }))} className="w-full rounded-xl border-2 border-gray-100 px-4 py-3 outline-none focus:border-primary" />
                                                    </label>
                                                    <label className="space-y-2 text-sm font-medium text-primary">
                                                        Zipcode
                                                        <input required type="text" value={formData.parent2ZipCode} onChange={(event) => setFormData((previous) => ({ ...previous, parent2ZipCode: event.target.value }))} className="w-full rounded-xl border-2 border-gray-100 px-4 py-3 outline-none focus:border-primary" />
                                                    </label>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </section>

                                {formData.children.map((child, index) => (
                                    <div key={index} className="space-y-5 rounded-2xl border-2 border-gray-100 p-6">
                                        <h4 className="font-bold text-primary uppercase tracking-widest text-sm">
                                            Child {index + 1}
                                        </h4>
                                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                            <label className="space-y-2 text-sm font-medium text-primary">
                                                First name
                                                <input required type="text" autoComplete="given-name" value={child.firstName} onChange={(event) => handleChildTextChange(index, 'firstName', event.target.value)} className="w-full rounded-xl border-2 border-gray-100 px-4 py-3 outline-none focus:border-primary" />
                                            </label>
                                            <label className="space-y-2 text-sm font-medium text-primary">
                                                Last name
                                                <input required type="text" autoComplete="family-name" value={child.lastName} onChange={(event) => handleChildTextChange(index, 'lastName', event.target.value)} className="w-full rounded-xl border-2 border-gray-100 px-4 py-3 outline-none focus:border-primary" />
                                            </label>
                                            <label className="space-y-2 text-sm font-medium text-primary">
                                                Grade
                                                <input required type="text" value={child.grade} onChange={(event) => handleChildTextChange(index, 'grade', event.target.value)} className="w-full rounded-xl border-2 border-gray-100 px-4 py-3 outline-none focus:border-primary" />
                                            </label>
                                            <label className="space-y-2 text-sm font-medium text-primary">
                                                Date of Birth
                                                <input required type="date" value={child.dateOfBirth} onChange={(event) => handleChildTextChange(index, 'dateOfBirth', event.target.value)} className="w-full rounded-xl border-2 border-gray-100 px-4 py-3 outline-none focus:border-primary" />
                                            </label>
                                            <label className="space-y-2 text-sm font-medium text-primary md:col-span-2">
                                                School Attends
                                                <input required type="text" value={child.school} onChange={(event) => handleChildTextChange(index, 'school', event.target.value)} className="w-full rounded-xl border-2 border-gray-100 px-4 py-3 outline-none focus:border-primary" />
                                            </label>
                                        </div>

                                        <fieldset className="space-y-3">
                                            <legend className="text-xs font-bold uppercase tracking-widest text-primary">Sacraments</legend>
                                            <div className="flex flex-wrap gap-4">
                                                {([
                                                    ['baptism', 'Baptism'],
                                                    ['reconciliation', 'Reconciliation'],
                                                    ['eucharist', 'Eucharist'],
                                                    ['confirmation', 'Confirmation'],
                                                ] as const).map(([key, label]) => (
                                                    <label key={key} className="flex items-center gap-2 text-sm text-muted-foreground">
                                                        <input
                                                            type="checkbox"
                                                            checked={child.sacraments[key]}
                                                            onChange={(event) => setFormData((previous) => ({
                                                                ...previous,
                                                                children: previous.children.map((item, childIndex) => childIndex === index
                                                                    ? { ...item, sacraments: { ...item.sacraments, [key]: event.target.checked } }
                                                                    : item),
                                                            }))}
                                                            className="accent-primary"
                                                        />
                                                        {label}
                                                    </label>
                                                ))}
                                            </div>
                                        </fieldset>

                                        {formData.children.length > 1 && index === 0 && (
                                            <label className="flex items-center gap-2 text-sm text-primary">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.sameEmergencyContact}
                                                    onChange={(event) => handleSameEmergencyContactChange(event.target.checked)}
                                                    className="accent-primary"
                                                />
                                                Apply to all children if the same
                                            </label>
                                        )}

                                        {(!formData.sameEmergencyContact || index === 0) && (
                                            <fieldset className="space-y-3">
                                                <legend className="text-xs font-bold uppercase tracking-widest text-primary">Emergency contact guardian first name</legend>
                                                <input required type="text" value={child.emergencyContactGuardianFirstName} onChange={(event) => handleChildTextChange(index, 'emergencyContactGuardianFirstName', event.target.value)} className="w-full rounded-xl border-2 border-gray-100 px-4 py-3 outline-none focus:border-primary" />
                                            </fieldset>
                                        )}
                                    </div>
                                ))}
                            </section>

                            <section className="space-y-4 border-t border-gray-100 pt-8">
                                <h4 className="font-bold text-primary uppercase tracking-widest text-sm">Tuition Fees</h4>
                                <div className="rounded-2xl bg-primary/5 p-6">
                                    <p className="text-sm text-muted-foreground">
                                        {formData.isMember
                                            ? formData.isMember === 'Yes'
                                                ? '$25 per child for parishioners; $50 maximum per family.'
                                                : '$25 per child for non-parishioners; $75 maximum per family.'
                                            : 'Registration is $25 per child, up to $50 per family for parishioners or $75 per family for non-parishioners.'}
                                    </p>
                                    <p className="mt-1 font-serif text-3xl font-bold text-primary">
                                        {formData.isMember
                                            ? `$${tuitionCost} total for ${formData.numberOfChildren} ${formData.numberOfChildren === 1 ? 'child' : 'children'}`
                                            : 'Select parish membership to calculate tuition'}
                                    </p>
                                    <p className="mt-4 text-sm text-muted-foreground">
                                        Tuition fees can be paid using our secure Faith Formation giving link.
                                    </p>
                                    <a
                                        href={FAITH_FORMATION_DONATION_URL}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-3 inline-flex rounded-full bg-primary px-5 py-3 text-sm font-bold text-white transition hover:bg-primary/90"
                                    >
                                        Donate to the Church
                                    </a>
                                </div>
                            </section>

                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-primary hover:bg-primary/90 py-6 text-sm font-bold uppercase tracking-widest"
                            >
                                {isSubmitting ? 'Processing...' : 'Review Registration'}
                            </Button>
                        </form>
                    </div>
                </div>
            )}
            {registrationSuccessTuition !== null && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary/40 p-4 backdrop-blur-sm">
                    <section
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="registration-success-title"
                        className="w-full max-w-lg rounded-3xl bg-white p-8 shadow-2xl"
                    >
                        <h2 id="registration-success-title" className="font-serif text-2xl font-bold text-primary">
                            Thank you for registering!
                        </h2>
                        <p className="mt-4 text-muted-foreground">
                            Total cost due: ${registrationSuccessTuition}. Please make your donation using the Faith Formation link below.
                        </p>
                        <a
                            href={FAITH_FORMATION_DONATION_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-5 inline-flex rounded-full bg-primary px-5 py-3 text-sm font-bold text-white transition hover:bg-primary/90"
                        >
                            Donate to Faith Formation
                        </a>
                        <p className="mt-5 text-muted-foreground">
                            A staff member from St. Therese should be able to reach out within 1–2 business days. If you have questions, please reach out to Bobby Myers at{' '}
                            <a className="font-medium text-primary underline" href="mailto:Bobby@strcstaff.org">
                                Bobby@strcstaff.org
                            </a>.
                        </p>
                        <Button
                            type="button"
                            className="mt-6 w-full"
                            onClick={() => setRegistrationSuccessTuition(null)}
                        >
                            Close
                        </Button>
                    </section>
                </div>
            )}
            {reviewDialog}
            <Footer />
        </div>
    );
}

function CategoryCard({ category }: { category: FaithCategory }) {
    const primaryCatechist = category.catechists[0];
    const extraCatechists = category.catechists.length - 1;

    return (
        <Card className="group flex h-full flex-col border-2 border-primary/5 hover:border-primary/30 transition-all duration-300 overflow-hidden bg-white shadow-sm hover:shadow-xl p-6 pb-3">
            <Link href={`/faith-formation/${category.id}`} className="block mb-2 group/title">
                <h3 className="font-serif text-2xl font-bold text-primary leading-tight group-hover/title:text-accent transition-colors">
                    {category.title}
                    {category.subtitle && (
                        <span className="block text-base font-medium text-muted-foreground mt-1 italic">
                            {category.subtitle}
                        </span>
                    )}
                </h3>
            </Link>
            <p className="text-muted-foreground leading-relaxed text-sm mb-3">
                {category.shortDescription}
                <span className="mt-2 block text-primary">
                    {category.location?.startsWith('Room') ? category.location : `Room: ${category.location}`}
                </span>
            </p>
            <div className="mt-auto -mx-6 px-6 py-4 bg-gray-50/50 border-t border-gray-100">
                {primaryCatechist && (
                    <div className="flex items-center gap-3 mb-4">
                        {(category.id === 'adult-education' || primaryCatechist.name === 'Kevin Baltzer') && primaryCatechist.photo && (
                            <div className="size-10 rounded-full overflow-hidden bg-primary/10 shrink-0 ring-2 ring-white">
                                <img
                                    src={primaryCatechist.photo}
                                    alt={primaryCatechist.name}
                                    className="w-full h-full object-cover"
                                    style={{ objectPosition: primaryCatechist.photoPosition ?? 'center 25%' }}
                                />
                            </div>
                        )}
                        <div className="min-w-0">
                            <p className="text-[9px] font-bold text-primary/40 uppercase tracking-widest">Catechist</p>
                            <p className="text-sm font-bold text-primary truncate">
                                {primaryCatechist.name}
                                {extraCatechists > 0 && (
                                    <span className="text-muted-foreground font-normal"> +{extraCatechists} more</span>
                                )}
                            </p>
                        </div>
                    </div>
                )}
                <Link href={`/faith-formation/${category.id}`}>
                    <a className="flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white py-3 rounded-full font-bold uppercase tracking-widest text-[10px] transition-all group/btn">
                        Learn More
                        <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                    </a>
                </Link>
            </div>
        </Card>
    );
}
