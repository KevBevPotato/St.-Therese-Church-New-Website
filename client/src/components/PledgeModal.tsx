import { useState, useRef, type FormEvent } from 'react';
import {
    X,
    Loader2,
    CheckCircle2,
    Phone,
    Mail,
    User as UserIcon,
    DollarSign,
    FileText,
} from 'lucide-react';
import { submitForm } from '@/lib/submit-form';
import { type SponsorshipItem } from '@/data/sponsorship-projects';

interface PledgeModalProps {
    isOpen: boolean;
    onClose: () => void;
    projectId: string;
    projectTitle: string;
    items: SponsorshipItem[];
    defaultItemId?: string;
}

interface PledgeFormState {
    from_name: string;
    from_email: string;
    from_phone: string;
    itemId: string;
    quantity: number;
    pledge_amount: string;
    note: string;
}

interface SubmitStatus {
    state: 'idle' | 'sending' | 'success' | 'error';
    message?: string;
}

const inputClassName =
    'w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-primary outline-none';

export default function PledgeModal({
    isOpen,
    onClose,
    projectId,
    projectTitle,
    items,
    defaultItemId,
}: PledgeModalProps) {
    const [status, setStatus] = useState<SubmitStatus>({ state: 'idle' });
    const formRef = useRef<HTMLFormElement>(null);

    const initialItemId =
        defaultItemId ??
        items.find(i => i.quantityFunded < i.quantityNeeded)?.id ??
        items[0]?.id ??
        '';

    const initialItem = items.find(i => i.id === initialItemId);

    const [form, setForm] = useState<PledgeFormState>({
        from_name: '',
        from_email: '',
        from_phone: '',
        itemId: initialItemId,
        quantity: 1,
        pledge_amount: initialItem?.unitPrice
            ? String(initialItem.unitPrice)
            : '',
        note: '',
    });

    const selectedItem = items.find(i => i.id === form.itemId);
    const selectedRemaining = selectedItem
        ? Math.max(selectedItem.quantityNeeded - selectedItem.quantityFunded, 0)
        : 0;

    const handleItemChange = (newItemId: string) => {
        const item = items.find(i => i.id === newItemId);
        const newAmount = item?.unitPrice
            ? String(item.unitPrice)
            : form.pledge_amount;
        setForm(f => ({
            ...f,
            itemId: newItemId,
            quantity: 1,
            pledge_amount: newAmount,
        }));
    };

    const updateField = <K extends keyof PledgeFormState>(
        key: K,
        value: PledgeFormState[K]
    ) => {
        setForm(f => ({ ...f, [key]: value }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!formRef.current) return;
        const website = new FormData(e.currentTarget).get('website');

        const pledgeAmount = Number(form.pledge_amount);
        if (!Number.isFinite(pledgeAmount) || pledgeAmount <= 0) {
            setStatus({
                state: 'error',
                message: 'Please enter a valid pledge amount.',
            });
            return;
        }

        setStatus({ state: 'sending' });

        try {
            const payload = {
                website: typeof website === 'string' ? website : '',
                from_name: form.from_name,
                from_email: form.from_email,
                from_phone: form.from_phone || '',
                project_id: projectId,
                project_title: projectTitle,
                item_id: form.itemId,
                item_label: selectedItem?.label ?? '(unspecified)',
                quantity: form.quantity,
                pledge_amount: pledgeAmount,
                memo_template: selectedItem?.memoTemplate ?? projectTitle,
                note: form.note || '',
            };

            await submitForm('pledge', payload);

            setStatus({
                state: 'success',
                message: `Thank you! Your pledge has been received. The parish office will follow up within 24 hours to coordinate payment.`,
            });
        } catch (err: any) {
            console.error('Sheets POST error:', err);
            setStatus({
                state: 'error',
                message:
                    'There was an issue submitting your pledge. Please email kevin.baltzer@strcstaff.org directly.',
            });
        }
    };

    const handleClose = () => {
        setStatus({ state: 'idle' });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-primary/40 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl my-8 overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="bg-primary p-6 text-white flex justify-between items-center">
                    <div>
                        <h3 className="font-serif text-2xl font-bold">
                            Make a Pledge
                        </h3>
                        <p className="text-xs text-white/70 uppercase tracking-widest mt-1">
                            {projectTitle}
                        </p>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors"
                        aria-label="Close pledge form"
                        type="button"
                    >
                        <X size={24} />
                    </button>
                </div>

                {status.state === 'success' && (
                    <div className="p-10 text-center space-y-5">
                        <div className="mx-auto w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
                            <CheckCircle2
                                size={48}
                                className="text-green-600"
                            />
                        </div>
                        <div>
                            <h4 className="font-serif text-2xl font-bold text-primary mb-3">
                                Pledge Received!
                            </h4>
                            <p className="text-muted-foreground leading-relaxed max-w-md mx-auto">
                                {status.message}
                            </p>
                            <p className="text-xs text-muted-foreground mt-4">
                                A copy has been emailed to the parish office and
                                recorded in the ledger.
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
                )}

                {status.state !== 'success' && (
                    <form
                        ref={formRef}
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
                            <span className="font-bold">How pledges work:</span>{' '}
                            This form records your intent to contribute. The
                            parish office will review the pledge and follow up
                            to process your gift through our secure payment
                            system.
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
                                    name="from_name"
                                    required
                                    value={form.from_name}
                                    onChange={e =>
                                        updateField('from_name', e.target.value)
                                    }
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
                                    name="from_email"
                                    required
                                    value={form.from_email}
                                    onChange={e =>
                                        updateField(
                                            'from_email',
                                            e.target.value
                                        )
                                    }
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
                                    name="from_phone"
                                    value={form.from_phone}
                                    onChange={e =>
                                        updateField(
                                            'from_phone',
                                            e.target.value
                                        )
                                    }
                                    className={`${inputClassName} pl-10`}
                                    placeholder="(605) 000-0000"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[11px] font-bold text-primary block">
                                Item You Would Like to Sponsor *
                            </label>
                            <select
                                name="itemId"
                                value={form.itemId}
                                onChange={e => handleItemChange(e.target.value)}
                                className={inputClassName}
                            >
                                {items.map(item => {
                                    const remaining = Math.max(
                                        item.quantityNeeded -
                                            item.quantityFunded,
                                        0
                                    );
                                    const priceLabel = item.unitPrice
                                        ? `– $${item.unitPrice}`
                                        : '';
                                    const remainingLabel =
                                        remaining === 0
                                            ? ' (fully funded)'
                                            : ` (${remaining} remaining)`;
                                    return (
                                        <option key={item.id} value={item.id}>
                                            {item.label} {priceLabel}
                                            {remainingLabel}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-primary block">
                                    Quantity *
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    max={Math.max(selectedRemaining, 1)}
                                    name="quantity"
                                    required
                                    value={form.quantity}
                                    onChange={e =>
                                        updateField(
                                            'quantity',
                                            Math.max(1, Number(e.target.value))
                                        )
                                    }
                                    className={inputClassName}
                                />
                                {selectedItem && (
                                    <p className="text-[10px] text-muted-foreground">
                                        {selectedRemaining} still needed
                                    </p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-primary block">
                                    Pledge Amount (USD) *
                                </label>
                                <div className="relative">
                                    <DollarSign
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/40"
                                        size={16}
                                    />
                                    <input
                                        type="number"
                                        min="1"
                                        step="0.01"
                                        name="pledge_amount"
                                        required
                                        value={form.pledge_amount}
                                        onChange={e =>
                                            updateField(
                                                'pledge_amount',
                                                e.target.value
                                            )
                                        }
                                        className={`${inputClassName} pl-10`}
                                        placeholder="80.00"
                                    />
                                </div>
                            </div>
                        </div>

                        {selectedItem?.memoTemplate && (
                            <div className="rounded-xl bg-primary/5 border border-primary/10 p-3 text-xs">
                                <p className="flex items-start gap-2 text-primary">
                                    <FileText
                                        size={14}
                                        className="flex-shrink-0 mt-0.5"
                                    />
                                    <span>
                                        <span className="font-bold">
                                            Suggested memo for myvanco:
                                        </span>{' '}
                                        <span className="font-mono">
                                            {selectedItem.memoTemplate}
                                        </span>
                                    </span>
                                </p>
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-[11px] font-bold text-primary block">
                                Note (optional)
                            </label>
                            <textarea
                                name="note"
                                rows={3}
                                value={form.note}
                                onChange={e =>
                                    updateField('note', e.target.value)
                                }
                                className={`${inputClassName} h-auto resize-none`}
                                placeholder="In memory of, in honor of, or any special instructions..."
                            />
                        </div>

                        {status.state === 'error' && (
                            <div className="rounded-xl bg-rose-50 border border-rose-200 p-4 text-sm text-rose-700">
                                {status.message}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={status.state === 'sending'}
                            className="w-full bg-primary hover:bg-primary/90 disabled:bg-primary/60 py-6 text-sm font-bold uppercase tracking-widest text-white rounded-full transition-all shadow-lg shadow-primary/10 flex items-center justify-center gap-2"
                        >
                            {status.state === 'sending' ? (
                                <>
                                    <Loader2
                                        size={16}
                                        className="animate-spin"
                                    />{' '}
                                    Submitting...
                                </>
                            ) : (
                                'Submit Pledge'
                            )}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
