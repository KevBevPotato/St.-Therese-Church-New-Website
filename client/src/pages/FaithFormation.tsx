import { useState } from 'react';
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

/**
 * Faith Formation Landing Page
 */

type FormSacraments = {
    baptism: boolean;
    firstCommunion: boolean;
    confession: boolean;
    confirmation: boolean;
};

interface ChildData {
    fullName: string;
    preferredName: string;
    school: string;
    phone: string;
    sacraments: FormSacraments;
    contactPreference: 'email' | 'text';
}

interface FormData {
    numberOfChildren: number;
    children: ChildData[];
    fatherFullName: string;
    fatherReligion: string;
    fatherCell: string;
    fatherEmail: string;
    fatherContactPreference: 'email' | 'text';
    motherFullName: string;
    motherReligion: string;
    motherCell: string;
    motherEmail: string;
    motherContactPreference: 'email' | 'text';
    streetAddress: string;
    city: string;
    state: string;
    zipCode: string;
    isMember: string;
    massAttendance: string;
    tuitionOption: 'per-child' | 'family';
    tuitionPaid: string;
    needsFinancialAssistance: boolean;
    specialNeeds: string;
}

type GroupFilter = FaithGroup | 'all';

const groupFilters: { id: GroupFilter; label: string }[] = [
    { id: 'all', label: 'All Programs' },
    { id: 'elementary', label: 'Elementary' },
    { id: 'middle-school', label: 'Middle School' },
    { id: 'high-school', label: 'High School' },
    { id: 'adult', label: 'Adult' },
];

const defaultChildData: ChildData = {
    fullName: '',
    preferredName: '',
    school: '',
    phone: '',
    sacraments: {
        baptism: false,
        firstCommunion: false,
        confession: false,
        confirmation: false,
    },
    contactPreference: 'email',
};

export default function FaithFormation() {
    const [, navigate] = useLocation();
    const [selectedGroups, setSelectedGroups] = useState<Set<GroupFilter>>(new Set<GroupFilter>(['all']));
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { reviewSubmission, reviewDialog } = useSubmissionReview();
    const [formData, setFormData] = useState<FormData>({
        numberOfChildren: 1,
        children: [{ ...defaultChildData }],
        fatherFullName: '',
        fatherReligion: '',
        fatherCell: '',
        fatherEmail: '',
        fatherContactPreference: 'email',
        motherFullName: '',
        motherReligion: '',
        motherCell: '',
        motherEmail: '',
        motherContactPreference: 'email',
        streetAddress: '',
        city: '',
        state: '',
        zipCode: '',
        isMember: '',
        massAttendance: '',
        tuitionOption: 'per-child',
        tuitionPaid: '',
        needsFinancialAssistance: false,
        specialNeeds: '',
    });

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

    const tuitionCost = (() => {
        const isMember = formData.isMember === 'Yes';
        const numChildren = formData.numberOfChildren;
        if (formData.tuitionOption === 'family') {
            return isMember ? 50 : 100;
        }
        return isMember ? 25 * numChildren : 50 * numChildren;
    })();

    const handleNumberOfChildrenChange = (num: number) => {
        const newChildren = [...formData.children];
        if (num > formData.numberOfChildren) {
            for (let i = formData.numberOfChildren; i < num; i++) {
                newChildren.push({ ...defaultChildData });
            }
        } else {
            newChildren.splice(num);
        }
        setFormData((prev) => ({ ...prev, numberOfChildren: num, children: newChildren }));
    };

    const handleChildChange = (childIndex: number, field: keyof ChildData, value: any) => {
        const newChildren = [...formData.children];
        if (field === 'sacraments') {
            newChildren[childIndex].sacraments = value;
        } else {
            (newChildren[childIndex] as any)[field] = value;
        }
        setFormData((prev) => ({ ...prev, children: newChildren }));
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            setFormData((prev) => ({
                ...prev,
                [name]: (e.target as HTMLInputElement).checked,
            }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const payload: Record<string, string> = {
            number_of_children: String(formData.numberOfChildren),
            father_full_name: formData.fatherFullName.trim(),
            father_religion: formData.fatherReligion.trim(),
            father_cell: formData.fatherCell.trim(),
            father_email: formData.fatherEmail.trim(),
            father_contact_preference: formData.fatherContactPreference,
            mother_full_name: formData.motherFullName.trim(),
            mother_religion: formData.motherReligion.trim(),
            mother_cell: formData.motherCell.trim(),
            mother_email: formData.motherEmail.trim(),
            mother_contact_preference: formData.motherContactPreference,
            street_address: formData.streetAddress.trim(),
            city: formData.city.trim(),
            state: formData.state.trim(),
            zip_code: formData.zipCode.trim(),
            is_member: formData.isMember,
            mass_attendance: formData.massAttendance,
            tuition_option: formData.tuitionOption,
            tuition_paid: formData.tuitionPaid.trim(),
            needs_financial_assistance: String(formData.needsFinancialAssistance),
            special_needs: formData.specialNeeds.trim(),
        };
        formData.children.forEach((child, index) => {
            const prefix = `child_${index + 1}_`;
            payload[`${prefix}full_name`] = child.fullName.trim();
            payload[`${prefix}preferred_name`] = child.preferredName.trim();
            payload[`${prefix}school`] = child.school.trim();
            payload[`${prefix}phone`] = child.phone.trim();
            payload[`${prefix}sacraments_received`] = Object.entries(child.sacraments)
                .filter(([, received]) => received)
                .map(([sacrament]) => sacrament)
                .join(', ');
            payload[`${prefix}contact_preference`] = child.contactPreference;
        });

        reviewSubmission('Faith Formation Registration', payload, async () => {
            setIsSubmitting(true);
            try {
                await submitForm('faith_formation_registration', payload);
                alert(
                    `Thank you for registering! Total cost due: $${tuitionCost}. We will contact you soon with more information.`
                );
                setIsSubmitting(false);
                setIsFormOpen(false);
                setFormData({
                    numberOfChildren: 1,
                    children: [{ ...defaultChildData }],
                    fatherFullName: '',
                    fatherReligion: '',
                    fatherCell: '',
                    fatherEmail: '',
                    fatherContactPreference: 'email',
                    motherFullName: '',
                    motherReligion: '',
                    motherCell: '',
                    motherEmail: '',
                    motherContactPreference: 'email',
                    streetAddress: '',
                    city: '',
                    state: '',
                    zipCode: '',
                    isMember: '',
                    massAttendance: '',
                    tuitionOption: 'per-child',
                    tuitionPaid: '',
                    needsFinancialAssistance: false,
                    specialNeeds: '',
                });
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
            <Header />
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
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-primary/40 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl my-8 overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="bg-primary p-6 text-white flex justify-between items-center">
                            <div>
                                <h3 className="font-serif text-2xl font-bold">Program Registration</h3>
                                <p className="text-xs text-white/70 uppercase tracking-widest mt-1">Faith Formation 2026-2027</p>
                            </div>
                            <button
                                onClick={() => setIsFormOpen(false)}
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
                            <div className="bg-accent/5 p-6 rounded-2xl border border-accent/10 mb-8">
                                <h4 className="font-bold text-primary mb-2 flex items-center gap-2">
                                    <Heart size={18} className="text-accent" /> Registration Information
                                </h4>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    Please fill out the form below to register your children for our Faith Formation programs. {faithFormationSettings.classNote}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-primary uppercase tracking-widest">Number of Children</label>
                                    <select
                                        name="numberOfChildren"
                                        value={formData.numberOfChildren}
                                        onChange={(e) => handleNumberOfChildrenChange(parseInt(e.target.value))}
                                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-primary outline-none"
                                    >
                                        <option value={0}>No children</option>
                                        {[1, 2, 3, 4, 5, 6].map((num) => (
                                            <option key={num} value={num}>
                                                {num} {num === 1 ? 'Child' : 'Children'}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-primary uppercase tracking-widest">
                                        Are you a member at St. Thérèse?
                                    </label>
                                    <div className="flex gap-4 pt-2">
                                        {['Yes', 'No'].map((opt) => (
                                            <label key={opt} className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="isMember"
                                                    value={opt}
                                                    checked={formData.isMember === opt}
                                                    onChange={handleInputChange}
                                                    className="accent-primary"
                                                />
                                                <span className="text-sm text-muted-foreground">{opt}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {formData.children.map((child, idx) => (
                                <div key={idx} className="p-6 border-2 border-gray-50 rounded-2xl space-y-4">
                                    <h4 className="font-bold text-primary uppercase tracking-widest text-sm">Child #{idx + 1}</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <input
                                            type="text"
                                            placeholder="Full Name"
                                            value={child.fullName}
                                            onChange={(e) => handleChildChange(idx, 'fullName', e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-primary outline-none"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Preferred Name"
                                            value={child.preferredName}
                                            onChange={(e) => handleChildChange(idx, 'preferredName', e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-primary outline-none"
                                        />
                                        <input
                                            type="text"
                                            placeholder="School"
                                            value={child.school}
                                            onChange={(e) => handleChildChange(idx, 'school', e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-primary outline-none"
                                        />
                                        <input
                                            type="tel"
                                            placeholder="Phone (if applicable)"
                                            value={child.phone}
                                            onChange={(e) => handleChildChange(idx, 'phone', e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-primary outline-none"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-primary uppercase tracking-widest">Sacraments Received:</label>
                                        <div className="flex flex-wrap gap-4">
                                            {Object.keys(child.sacraments).map((sac) => (
                                                <label key={sac} className="flex items-center gap-2 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={(child.sacraments as any)[sac]}
                                                        onChange={(e) =>
                                                            handleChildChange(idx, 'sacraments', {
                                                                ...child.sacraments,
                                                                [sac]: e.target.checked,
                                                            })
                                                        }
                                                        className="accent-primary"
                                                    />
                                                    <span className="text-xs text-muted-foreground capitalize">
                                                        {sac.replace(/([A-Z])/g, ' $1')}
                                                    </span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <div className="pt-8 border-t border-gray-100">
                                <h4 className="font-bold text-primary mb-4 uppercase tracking-widest text-sm">Parent/Guardian Information</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <input
                                            type="text"
                                            name="fatherFullName"
                                            placeholder="Father's Full Name"
                                            value={formData.fatherFullName}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-primary outline-none"
                                        />
                                        <input
                                            type="tel"
                                            name="fatherCell"
                                            placeholder="Father's Cell Phone"
                                            value={formData.fatherCell}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-primary outline-none"
                                        />
                                        <input
                                            type="email"
                                            name="fatherEmail"
                                            placeholder="Father's Email"
                                            value={formData.fatherEmail}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-primary outline-none"
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <input
                                            type="text"
                                            name="motherFullName"
                                            placeholder="Mother's Full Name"
                                            value={formData.motherFullName}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-primary outline-none"
                                        />
                                        <input
                                            type="tel"
                                            name="motherCell"
                                            placeholder="Mother's Cell Phone"
                                            value={formData.motherCell}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-primary outline-none"
                                        />
                                        <input
                                            type="email"
                                            name="motherEmail"
                                            placeholder="Mother's Email"
                                            value={formData.motherEmail}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-primary outline-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-8 border-t border-gray-100">
                                <h4 className="font-bold text-primary mb-4 uppercase tracking-widest text-sm">Tuition & Payment</h4>
                                <div className="bg-primary/5 p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div>
                                        <p className="text-sm text-muted-foreground">
                                            Tuition Fee ({formData.isMember === 'Yes' ? 'Member' : 'Non-Member'})
                                        </p>
                                        <p className="text-3xl font-serif font-bold text-primary">${tuitionCost}</p>
                                    </div>
                                    <div className="flex gap-4">
                                        {['per-child', 'family'].map((opt) => (
                                            <label key={opt} className="flex items-center gap-2 cursor-pointer bg-white px-4 py-2 rounded-xl border border-primary/10">
                                                <input
                                                    type="radio"
                                                    name="tuitionOption"
                                                    value={opt}
                                                    checked={formData.tuitionOption === opt}
                                                    onChange={handleInputChange}
                                                    className="accent-primary"
                                                />
                                                <span className="text-sm text-primary font-bold capitalize">
                                                    {opt.replace('-', ' ')}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>

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
