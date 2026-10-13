// --- File: client/src/components/SupperVolunteerModal.tsx ---
import { useState, useEffect, useMemo, type FormEvent } from 'react';
import {
    X,
    Loader2,
    CheckCircle2,
    Phone,
    Mail,
    User as UserIcon,
    Calendar,
    Users,
    HandHeart,
    Check,
    XIcon,
} from 'lucide-react';
import { submitForm } from '@/lib/submit-form';
import { useSubmissionReview } from '@/hooks/use-submission-review';

interface VolunteerRole {
    name: string;
    needed: number;
    filled: number;
}

interface WednesdayWeek {
    id: string;
    dateLabel: string;
    date: Date;
    sponsor: string | null;
    sponsored: boolean;
    roles: VolunteerRole[];
}

interface SupperVolunteerModalProps {
    isOpen: boolean;
    onClose: () => void;
    week: WednesdayWeek | null; // When provided, modal opens in "Sign Up" mode for that week
    allWeeks?: WednesdayWeek[]; // Needed for "I'm Willing to Help" mode
}

type SubmitStatus = 'idle' | 'sending' | 'success' | 'error';
type SignupMode = 'specific' | 'willing';
type AvailabilityType = 'available' | 'unavailable';

const inputClassName =
    'w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-primary outline-none';

const ROLE_OPTIONS = [
    'Grocery Pick-up',
    'Food Prep',
    'Food Server',
    'Clean-up Crew',
];

export default function SupperVolunteerModal({
    isOpen,
    onClose,
    week,
    allWeeks = [],
}: SupperVolunteerModalProps) {
    const [status, setStatus] = useState<SubmitStatus>('idle');
    const [errorMessage, setErrorMessage] = useState('');
    const { reviewSubmission, reviewDialog } = useSubmissionReview();

    // Mode: "specific" (sign up for this week) or "willing" (general availability)
    const [mode, setMode] = useState<SignupMode>(week ? 'specific' : 'willing');

    // Shared form fields
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [notes, setNotes] = useState('');

    // "Specific" mode fields
    const [selectedRole, setSelectedRole] = useState('');

    // "Willing" mode fields
    const [availabilityType, setAvailabilityType] =
        useState<AvailabilityType>('available');
    const [selectedWeeks, setSelectedWeeks] = useState<Set<string>>(new Set());
    const [preferredRoles, setPreferredRoles] = useState<Set<string>>(
        new Set()
    );

    // Reset form when modal opens/closes or target week changes
    useEffect(() => {
        if (isOpen) {
            setStatus('idle');
            setErrorMessage('');
            setName('');
            setEmail('');
            setPhone('');
            setNotes('');
            setSelectedRole('');
            setSelectedWeeks(new Set());
            setPreferredRoles(new Set());
            setMode(week ? 'specific' : 'willing');
            setAvailabilityType('available');
        }
    }, [isOpen, week?.id]);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const website = new FormData(e.currentTarget).get('website');
        const basePayload: Record<string, any> = {
            website: typeof website === 'string' ? website : '',
            full_name: name,
            email: email,
            phone: phone,
            notes: notes,
            signup_mode: mode,
        };

        if (mode === 'specific' && week) {
            basePayload.week_id = week.id;
            basePayload.week_date = week.dateLabel;
            basePayload.role = selectedRole;
            basePayload.availability_type = '';
            basePayload.week_ids = '';
            basePayload.preferred_roles = '';
        } else {
            basePayload.week_id = '';
            basePayload.week_date = '';
            basePayload.role = '';
            basePayload.availability_type = availabilityType;
            basePayload.week_ids = Array.from(selectedWeeks).join(', ');
            basePayload.preferred_roles =
                Array.from(preferredRoles).join(', ');
        }

        reviewSubmission('Wednesday Supper Volunteer Signup', basePayload, async () => {
            setStatus('sending');
            setErrorMessage('');
            try {
                await submitForm('supper-volunteer', basePayload);
                setStatus('success');
            } catch (err: any) {
                console.error('Supper volunteer POST error:', err);
                setStatus('error');
                setErrorMessage(
                    'There was an issue submitting. Please email kevin.baltzer@strcstaff.org directly.'
                );
            }
        });
    };

    const toggleWeek = (weekId: string) => {
        const next = new Set(selectedWeeks);
        if (next.has(weekId)) next.delete(weekId);
        else next.add(weekId);
        setSelectedWeeks(next);
    };

    const toggleRole = (roleName: string) => {
        const next = new Set(preferredRoles);
        if (next.has(roleName)) next.delete(roleName);
        else next.add(roleName);
        setPreferredRoles(next);
    };

    // Group weeks by month for the "willing" mode
    const monthGroups = useMemo(() => {
        if (mode !== 'willing' || allWeeks.length === 0) return [];
        const groups: Record<
            string,
            { label: string; weeks: WednesdayWeek[] }
        > = {};
        allWeeks.forEach(w => {
            const monthName = w.date.toLocaleString('default', {
                month: 'long',
                year: 'numeric',
            });
            if (!groups[monthName])
                groups[monthName] = { label: monthName, weeks: [] };
            groups[monthName].weeks.push(w);
        });
        return Object.values(groups);
    }, [mode, allWeeks]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-primary/40 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
            {reviewDialog}
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl my-8 overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="bg-primary p-6 text-white flex justify-between items-center">
                    <div>
                        <h3 className="font-serif text-2xl font-bold">
                            {mode === 'specific'
                                ? 'Sign Up to Volunteer'
                                : "I'm Willing to Help"}
                        </h3>
                        <p className="text-xs text-white/70 uppercase tracking-widest mt-1 flex items-center gap-1.5">
                            <Calendar size={12} />
                            {mode === 'specific' && week
                                ? week.dateLabel
                                : 'Wednesday Night Supper'}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors"
                        aria-label="Close form"
                        type="button"
                    >
                        <X size={24} />
                    </button>
                </div>

                {status === 'success' ? (
                    <div className="p-10 text-center space-y-5">
                        <div className="mx-auto w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
                            <CheckCircle2
                                size={48}
                                className="text-green-600"
                            />
                        </div>
                        <div>
                            <h4 className="font-serif text-2xl font-bold text-primary mb-3">
                                Thank You!
                            </h4>
                            {mode === 'specific' && week ? (
                                <p className="text-muted-foreground leading-relaxed max-w-md mx-auto">
                                    Your sign-up for{' '}
                                    <strong>{week.dateLabel}</strong> as a{' '}
                                    <strong>{selectedRole}</strong> has been
                                    recorded. The Wednesday Supper coordinator
                                    will reach out within a week to confirm
                                    details.
                                </p>
                            ) : (
                                <p className="text-muted-foreground leading-relaxed max-w-md mx-auto">
                                    Your availability has been recorded. We'll
                                    reach out when we need help on the weeks you
                                    marked as available. Thank you for your
                                    willingness to serve!
                                </p>
                            )}
                        </div>
                        <div className="pt-4">
                            <button
                                onClick={onClose}
                                className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-full font-bold uppercase tracking-widest text-sm shadow-md hover:shadow-lg active:scale-95 transition-all"
                                type="button"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                ) : (
                    <form
                        className="p-8 space-y-5 max-h-[70vh] overflow-y-auto custom-scrollbar"
                        onSubmit={handleSubmit}
                    >
                        <input
                            type="text"
                            name="website"
                            tabIndex={-1}
                            autoComplete="off"
                            aria-hidden="true"
                            className="absolute -left-[9999px]"
                        />
                        {/* Mode toggle (only show if both modes are available) */}
                        {week && allWeeks.length > 0 && (
                            <div className="rounded-2xl border border-primary/15 bg-primary/5 p-1.5 flex gap-1.5">
                                <button
                                    type="button"
                                    onClick={() => setMode('specific')}
                                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
                                        mode === 'specific'
                                            ? 'bg-primary text-white shadow-md'
                                            : 'text-primary/70 hover:bg-white/60'
                                    }`}
                                >
                                    <Calendar size={14} /> Sign Up for{' '}
                                    {week.dateLabel}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setMode('willing')}
                                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
                                        mode === 'willing'
                                            ? 'bg-primary text-white shadow-md'
                                            : 'text-primary/70 hover:bg-white/60'
                                    }`}
                                >
                                    <HandHeart size={14} /> I'm Willing to Help
                                </button>
                            </div>
                        )}

                        <div className="rounded-2xl border border-accent/20 bg-accent/5 p-4 text-sm text-primary leading-relaxed">
                            {mode === 'specific' ? (
                                <>
                                    <span className="font-bold">
                                        Sign up for {week?.dateLabel}:
                                    </span>{' '}
                                    Choose a role and we'll confirm your spot
                                    within a week.
                                </>
                            ) : (
                                <>
                                    <span className="font-bold">
                                        Tell us your general availability:
                                    </span>{' '}
                                    Pick either the weeks you're available OR
                                    the weeks you're NOT available — whichever
                                    is easier. We'll reach out when we need
                                    help.
                                </>
                            )}
                        </div>

                        {/* Contact fields (shared) */}
                        <div className="space-y-2">
                            <label className="text-[11px] font-bold text-primary block">
                                Full Name *
                            </label>
                            <div className="relative">
                                <UserIcon
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/40"
                                    size={16}
                                />
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    className={`${inputClassName} pl-10`}
                                    placeholder="Your Full Name"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[11px] font-bold text-primary block">
                                Email Address *
                            </label>
                            <div className="relative">
                                <Mail
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/40"
                                    size={16}
                                />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    className={`${inputClassName} pl-10`}
                                    placeholder="you@example.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[11px] font-bold text-primary block">
                                Phone Number (optional)
                            </label>
                            <div className="relative">
                                <Phone
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/40"
                                    size={16}
                                />
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={e => setPhone(e.target.value)}
                                    className={`${inputClassName} pl-10`}
                                    placeholder="(605) 000-0000"
                                />
                            </div>
                        </div>

                        {/* ====== SPECIFIC MODE: pick a role ====== */}
                        {mode === 'specific' && week && (
                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-primary block">
                                    Which role would you like to help with? *
                                </label>
                                <div className="space-y-2">
                                    {ROLE_OPTIONS.map(roleName => {
                                        const role = week.roles.find(
                                            r => r.name === roleName
                                        );
                                        const remaining = role
                                            ? Math.max(
                                                  role.needed - role.filled,
                                                  0
                                              )
                                            : 0;
                                        const isFull = remaining === 0;
                                        return (
                                            <label
                                                key={roleName}
                                                className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                                                    selectedRole === roleName
                                                        ? 'border-primary bg-primary/5'
                                                        : isFull
                                                          ? 'border-gray-100 bg-gray-50 opacity-60 cursor-not-allowed'
                                                          : 'border-gray-100 hover:border-primary/30'
                                                }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="role"
                                                    value={roleName}
                                                    checked={
                                                        selectedRole ===
                                                        roleName
                                                    }
                                                    onChange={e =>
                                                        setSelectedRole(
                                                            e.target.value
                                                        )
                                                    }
                                                    disabled={isFull}
                                                    className="accent-primary"
                                                />
                                                <div className="flex-1 flex items-center gap-2">
                                                    <Users
                                                        size={14}
                                                        className="text-primary/60"
                                                    />
                                                    <span className="text-sm font-bold text-primary">
                                                        {roleName}
                                                    </span>
                                                </div>
                                                <span
                                                    className={`text-[10px] font-bold uppercase tracking-widest ${
                                                        isFull
                                                            ? 'text-green-600'
                                                            : 'text-rose-600'
                                                    }`}
                                                >
                                                    {isFull
                                                        ? 'Full'
                                                        : `${remaining} open`}
                                                </span>
                                            </label>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* ====== WILLING MODE: pick availability type + weeks + roles ====== */}
                        {mode === 'willing' && (
                            <>
                                {/* Availability type toggle */}
                                <div className="space-y-3">
                                    <label className="text-[11px] font-bold text-primary block">
                                        How would you like to indicate your
                                        availability? *
                                    </label>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setAvailabilityType(
                                                    'available'
                                                );
                                                setSelectedWeeks(new Set());
                                            }}
                                            className={`p-4 rounded-2xl border-2 text-left transition-all ${
                                                availabilityType === 'available'
                                                    ? 'border-primary bg-primary/5 shadow-md'
                                                    : 'border-gray-100 hover:border-primary/30'
                                            }`}
                                        >
                                            <div className="flex items-center gap-2 mb-2">
                                                <div
                                                    className={`size-8 rounded-full flex items-center justify-center ${
                                                        availabilityType ===
                                                        'available'
                                                            ? 'bg-primary text-white'
                                                            : 'bg-primary/10 text-primary'
                                                    }`}
                                                >
                                                    <Check size={16} />
                                                </div>
                                                <span className="text-sm font-bold text-primary">
                                                    Weeks I'm Available
                                                </span>
                                            </div>
                                            <p className="text-xs text-muted-foreground leading-relaxed">
                                                Select the specific Wednesdays
                                                you can help. Pick as many or as
                                                few as you like.
                                            </p>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => {
                                                setAvailabilityType(
                                                    'unavailable'
                                                );
                                                setSelectedWeeks(new Set());
                                            }}
                                            className={`p-4 rounded-2xl border-2 text-left transition-all ${
                                                availabilityType ===
                                                'unavailable'
                                                    ? 'border-primary bg-primary/5 shadow-md'
                                                    : 'border-gray-100 hover:border-primary/30'
                                            }`}
                                        >
                                            <div className="flex items-center gap-2 mb-2">
                                                <div
                                                    className={`size-8 rounded-full flex items-center justify-center ${
                                                        availabilityType ===
                                                        'unavailable'
                                                            ? 'bg-primary text-white'
                                                            : 'bg-primary/10 text-primary'
                                                    }`}
                                                >
                                                    <XIcon size={16} />
                                                </div>
                                                <span className="text-sm font-bold text-primary">
                                                    Weeks I'm NOT Available
                                                </span>
                                            </div>
                                            <p className="text-xs text-muted-foreground leading-relaxed">
                                                Easier if you only know a few
                                                conflicts. We'll know you can
                                                help any other week.
                                            </p>
                                        </button>
                                    </div>
                                </div>

                                {/* Week selection grid */}
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <label className="text-[11px] font-bold text-primary block">
                                            Select weeks ({selectedWeeks.size}{' '}
                                            chosen)
                                        </label>
                                        <div className="flex gap-2">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setSelectedWeeks(
                                                        new Set(
                                                            allWeeks.map(
                                                                w => w.id
                                                            )
                                                        )
                                                    )
                                                }
                                                className="text-[10px] font-bold text-accent hover:text-accent/80 uppercase tracking-widest"
                                            >
                                                Select All
                                            </button>
                                            <span className="text-primary/20">
                                                |
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setSelectedWeeks(new Set())
                                                }
                                                className="text-[10px] font-bold text-primary/60 hover:text-primary uppercase tracking-widest"
                                            >
                                                Clear
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-4 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                                        {monthGroups.map(group => (
                                            <div key={group.label}>
                                                <p className="text-[10px] font-bold text-primary/60 uppercase tracking-widest mb-2">
                                                    {group.label}
                                                </p>
                                                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                                                    {group.weeks.map(w => {
                                                        const isSelected =
                                                            selectedWeeks.has(
                                                                w.id
                                                            );
                                                        return (
                                                            <button
                                                                key={w.id}
                                                                type="button"
                                                                onClick={() =>
                                                                    toggleWeek(
                                                                        w.id
                                                                    )
                                                                }
                                                                className={`p-3 rounded-xl border-2 text-center transition-all ${
                                                                    isSelected
                                                                        ? 'border-primary bg-primary text-white shadow-md'
                                                                        : 'border-gray-100 hover:border-primary/30 bg-white'
                                                                }`}
                                                            >
                                                                <p
                                                                    className={`text-[9px] font-bold uppercase tracking-widest ${
                                                                        isSelected
                                                                            ? 'text-white/70'
                                                                            : 'text-primary/60'
                                                                    }`}
                                                                >
                                                                    {w.date.toLocaleString(
                                                                        'default',
                                                                        {
                                                                            month: 'short',
                                                                        }
                                                                    )}
                                                                </p>
                                                                <p
                                                                    className={`text-lg font-serif font-bold leading-none mt-1 ${
                                                                        isSelected
                                                                            ? 'text-white'
                                                                            : 'text-primary'
                                                                    }`}
                                                                >
                                                                    {w.date.getDate()}
                                                                </p>
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Preferred roles (optional) */}
                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-primary block">
                                        Preferred roles (optional, select any
                                        that apply)
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {ROLE_OPTIONS.map(roleName => {
                                            const isSelected =
                                                preferredRoles.has(roleName);
                                            return (
                                                <button
                                                    key={roleName}
                                                    type="button"
                                                    onClick={() =>
                                                        toggleRole(roleName)
                                                    }
                                                    className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all border-2 ${
                                                        isSelected
                                                            ? 'bg-accent border-accent text-white shadow-md'
                                                            : 'bg-white border-gray-100 text-primary/70 hover:border-accent/40'
                                                    }`}
                                                >
                                                    {roleName}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </>
                        )}

                        <div className="space-y-2">
                            <label className="text-[11px] font-bold text-primary block">
                                Notes (optional)
                            </label>
                            <textarea
                                value={notes}
                                onChange={e => setNotes(e.target.value)}
                                className={`${inputClassName} h-auto resize-none`}
                                placeholder="Any dietary restrictions, scheduling notes, or questions..."
                                rows={3}
                            />
                        </div>

                        {status === 'error' && (
                            <div className="rounded-xl bg-rose-50 border border-rose-200 p-4 text-sm text-rose-700">
                                {errorMessage}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={
                                status === 'sending' ||
                                (mode === 'specific' && !selectedRole) ||
                                (mode === 'willing' && selectedWeeks.size === 0)
                            }
                            className="w-full bg-primary hover:bg-primary/90 disabled:bg-primary/60 disabled:cursor-not-allowed py-6 text-sm font-bold uppercase tracking-widest text-white rounded-full transition-all shadow-lg shadow-primary/10 flex items-center justify-center gap-2"
                        >
                            {status === 'sending' ? (
                                <>
                                    <Loader2
                                        size={16}
                                        className="animate-spin"
                                    />{' '}
                                    Submitting...
                                </>
                            ) : mode === 'specific' ? (
                                <>
                                    <Users size={16} /> Sign Me Up
                                </>
                            ) : (
                                <>
                                    <HandHeart size={16} /> Submit My
                                    Availability
                                </>
                            )}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
