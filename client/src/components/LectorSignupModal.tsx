import { useState, type FormEvent } from 'react';
import {
    X,
    Loader2,
    CheckCircle2,
    Phone,
    Mail,
    User as UserIcon,
    BookOpen,
} from 'lucide-react';
import { submitForm } from '@/lib/submit-form';

interface LectorSignupModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type SubmitStatus = 'idle' | 'sending' | 'success' | 'error';

const inputClassName =
    'w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-primary outline-none';

const MASS_TIMES = [
    { value: 'Saturday 4:30 PM', label: 'Saturday 4:30 PM' },
    { value: 'Sunday 9:00 AM', label: 'Sunday 9:00 AM' },
    { value: 'Sunday 5:30 PM', label: 'Sunday 5:30 PM' },
    { value: 'Varies', label: 'Varies / Different Each Week' },
];

export default function LectorSignupModal({
    isOpen,
    onClose,
}: LectorSignupModalProps) {
    const [status, setStatus] = useState<SubmitStatus>('idle');
    const [errorMessage, setErrorMessage] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [sundayMass, setSundayMass] = useState('');

    const resetForm = () => {
        setStatus('idle');
        setErrorMessage('');
        setName('');
        setEmail('');
        setPhone('');
        setSundayMass('');
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const website = new FormData(e.currentTarget).get('website');
        setStatus('sending');
        setErrorMessage('');

        try {
            const payload = {
                website: typeof website === 'string' ? website : '',
                from_name: name,
                from_email: email,
                from_phone: phone,
                sunday_mass: sundayMass,
            };

            await submitForm('lector', payload);

            setStatus('success');
        } catch (err: any) {
            console.error('Lector signup POST error:', err);
            setStatus('error');
            setErrorMessage(
                'There was an issue submitting. Please email kevin.baltzer@strcstaff.org directly.'
            );
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-primary/40 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl my-8 overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="bg-primary p-6 text-white flex justify-between items-center">
                    <div>
                        <h3 className="font-serif text-2xl font-bold">
                            Lector Sign-up
                        </h3>
                        <p className="text-xs text-white/70 uppercase tracking-widest mt-1">
                            Liturgy Ministry
                        </p>
                    </div>
                    <button
                        onClick={handleClose}
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
                            <p className="text-muted-foreground leading-relaxed max-w-md mx-auto">
                                Your sign-up has been recorded. The liturgy
                                coordinator will reach out within a week to
                                schedule training and your first reading.
                            </p>
                            <p className="text-xs text-muted-foreground mt-4">
                                A copy of your submission has been emailed to
                                the parish office.
                            </p>
                        </div>
                        <div className="pt-4">
                            <button
                                onClick={handleClose}
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
                        <div className="rounded-2xl border border-accent/20 bg-accent/5 p-4 text-sm text-primary leading-relaxed">
                            <span className="font-bold">
                                About Lector Ministry:
                            </span>{' '}
                            Lectors proclaim the Scriptures and lead the Prayers
                            of the Faithful during Mass. Training and ongoing
                            scheduling support are provided for all new lectors.
                        </div>

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

                        <div className="space-y-2">
                            <label className="text-[11px] font-bold text-primary block">
                                Sunday Mass You Usually Attend *
                            </label>
                            <select
                                required
                                value={sundayMass}
                                onChange={e => setSundayMass(e.target.value)}
                                className={inputClassName}
                            >
                                <option value="">Select a Mass time...</option>
                                {MASS_TIMES.map(mass => (
                                    <option key={mass.value} value={mass.value}>
                                        {mass.label}
                                    </option>
                                ))}
                            </select>
                            <p className="text-[10px] text-muted-foreground">
                                We typically schedule lectors at the Mass they
                                attend most often.
                            </p>
                        </div>

                        {status === 'error' && (
                            <div className="rounded-xl bg-rose-50 border border-rose-200 p-4 text-sm text-rose-700">
                                {errorMessage}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={status === 'sending'}
                            className="w-full bg-primary hover:bg-primary/90 disabled:bg-primary/60 py-6 text-sm font-bold uppercase tracking-widest text-white rounded-full transition-all shadow-lg shadow-primary/10 flex items-center justify-center gap-2"
                        >
                            {status === 'sending' ? (
                                <>
                                    <Loader2
                                        size={16}
                                        className="animate-spin"
                                    />{' '}
                                    Submitting...
                                </>
                            ) : (
                                <>
                                    <BookOpen size={16} /> Sign Up
                                </>
                            )}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
