import { useState, useRef, useEffect, type FormEvent } from 'react';
import {
    X,
    Loader2,
    CheckCircle2,
    DollarSign,
    FileText,
    Heart,
    Sparkles,
} from 'lucide-react';
import { submitForm } from '@/lib/submit-form';
import { type EngagementConfig } from '@/data/engagements';

interface EngagementModalProps {
    isOpen: boolean;
    onClose: () => void;
    engagement: EngagementConfig;
    defaultItemId?: string;
    contextProjectTitle?: string;
    contextProjectId?: string;
}

type SubmitStatus = 'idle' | 'sending' | 'success' | 'error';

const inputClassName =
    'w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-primary outline-none';

export default function EngagementModal({
    isOpen,
    onClose,
    engagement,
    defaultItemId,
    contextProjectTitle,
    contextProjectId,
}: EngagementModalProps) {
    const [status, setStatus] = useState<SubmitStatus>('idle');
    const [errorMessage, setErrorMessage] = useState('');
    const formRef = useRef<HTMLFormElement>(null);

    const buildInitialState = () => {
        const state: Record<string, any> = {};
        engagement.fields.forEach(f => {
            state[f.id] = '';
        });

        if (
            engagement.type === 'pledge' &&
            engagement.items &&
            engagement.items.length > 0
        ) {
            const item = defaultItemId
                ? engagement.items.find(i => i.id === defaultItemId)
                : (engagement.items.find(
                      i => i.quantityFunded < i.quantityNeeded
                  ) ?? engagement.items[0]);
            state.selectedItemId = item?.id ?? '';
            state.quantity = 1;
            state.pledge_amount = item?.unitPrice?.toString() ?? '';
        }
        return state;
    };

    const [formState, setFormState] = useState(buildInitialState());

    const updateField = (key: string, value: any) => {
        setFormState(s => {
            const next = { ...s, [key]: value };
            if (engagement.type === 'pledge' && key === 'selectedItemId') {
                const item = engagement.items?.find(i => i.id === value);
                if (item?.unitPrice) {
                    next.quantity = 1;
                    next.pledge_amount = item.unitPrice.toString();
                }
            }
            return next;
        });
    };

    const selectedItem = engagement.items?.find(
        i => i.id === formState.selectedItemId
    );
    const selectedRemaining = selectedItem
        ? Math.max(selectedItem.quantityNeeded - selectedItem.quantityFunded, 0)
        : 0;

    /**
     * Prefill context fields when modal opens.
     * Only fills fields that haven't been edited yet.
     */
    useEffect(() => {
        if (!isOpen) return;
        if (!contextProjectTitle) return;

        setFormState(s => {
            const next = { ...s };
            if (engagement.contextAware) {
                if (
                    engagement.type === 'suggestion' &&
                    !next.context_opportunity
                ) {
                    next.context_opportunity = contextProjectTitle;
                }
                if (engagement.type === 'referral' && !next.opportunity) {
                    next.opportunity = contextProjectTitle;
                }
            }
            return next;
        });
    }, [isOpen, contextProjectTitle, engagement.contextAware, engagement.type]);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const website = new FormData(e.currentTarget).get('website');
        setStatus('sending');
        setErrorMessage('');

        try {
            const payload: Record<string, any> = {
                website: typeof website === 'string' ? website : '',
                engagement_type: engagement.type,
                engagement_id: engagement.id,
                project_title: engagement.title,
            };

            if (contextProjectId) payload.context_project_id = contextProjectId;
            if (contextProjectTitle)
                payload.context_project_title = contextProjectTitle;

            engagement.fields.forEach(f => {
                payload[f.id] = formState[f.id] ?? '';
            });

            if (engagement.type === 'pledge' && selectedItem) {
                payload.item_label = selectedItem.label;
                payload.item_id = selectedItem.id;
                payload.quantity = formState.quantity || 1;
                payload.pledge_amount = Number(formState.pledge_amount) || 0;
                payload.memo_template = selectedItem.memoTemplate;
            }

            await submitForm('engagement', payload);

            setStatus('success');
        } catch (err: any) {
            console.error('Engagement POST error:', err);
            setStatus('error');
            setErrorMessage(
                'There was an issue submitting. Please email kevin.baltzer@strcstaff.org directly.'
            );
        }
    };

    const handleClose = () => {
        setStatus('idle');
        setErrorMessage('');
        setFormState(buildInitialState());
        onClose();
    };

    if (!isOpen) return null;

    const isPledge = engagement.type === 'pledge';
    const showContextBanner = !!contextProjectTitle && engagement.contextAware;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-primary/40 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl my-8 overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="bg-primary p-6 text-white flex justify-between items-center">
                    <div>
                        <h3 className="font-serif text-2xl font-bold">
                            {engagement.title}
                        </h3>
                        <p className="text-xs text-white/70 uppercase tracking-widest mt-1">
                            {engagement.subtitle}
                        </p>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-2 hover:bg-white/10 rounded-full"
                        aria-label="Close"
                        type="button"
                    >
                        <X size={24} />
                    </button>
                </div>

                {status === 'success' && (
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
                                {engagement.thankYouMessage ??
                                    'Your submission has been received.'}
                            </p>
                        </div>
                        <button
                            onClick={handleClose}
                            className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-full font-bold uppercase tracking-widest text-sm"
                            type="button"
                        >
                            Close
                        </button>
                    </div>
                )}

                {status !== 'success' && (
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
                            {engagement.description}
                        </div>

                        {showContextBanner && (
                            <div className="rounded-xl bg-primary/5 border border-primary/15 p-3 text-xs flex items-start gap-2 text-primary">
                                <Sparkles
                                    size={14}
                                    className="flex-shrink-0 mt-0.5 text-accent"
                                />
                                <span>
                                    <span className="font-bold">
                                        In reference to:
                                    </span>{' '}
                                    <span className="italic">
                                        {contextProjectTitle}
                                    </span>
                                </span>
                            </div>
                        )}

                        {isPledge &&
                            engagement.items &&
                            engagement.items.length > 0 && (
                                <>
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-bold text-primary block">
                                            {engagement.id ===
                                            'pledge-supper-week'
                                                ? 'Choose a Wednesday to Sponsor *'
                                                : 'Item to Sponsor *'}
                                        </label>
                                        <select
                                            value={formState.selectedItemId}
                                            onChange={e =>
                                                updateField(
                                                    'selectedItemId',
                                                    e.target.value
                                                )
                                            }
                                            className={inputClassName}
                                        >
                                            {engagement.items.map(item => {
                                                const remaining = Math.max(
                                                    item.quantityNeeded -
                                                        item.quantityFunded,
                                                    0
                                                );
                                                const dateNote = item.date
                                                    ? ` · ${item.label}`
                                                    : '';
                                                return (
                                                    <option
                                                        key={item.id}
                                                        value={item.id}
                                                    >
                                                        {item.label}{' '}
                                                        {item.unitPrice
                                                            ? `– $${item.unitPrice}`
                                                            : ''}
                                                        {remaining === 0
                                                            ? ' (sponsored)'
                                                            : ''}
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
                                                max={Math.max(
                                                    selectedRemaining,
                                                    1
                                                )}
                                                value={formState.quantity || 1}
                                                onChange={e =>
                                                    updateField(
                                                        'quantity',
                                                        Math.max(
                                                            1,
                                                            Number(
                                                                e.target.value
                                                            )
                                                        )
                                                    )
                                                }
                                                className={inputClassName}
                                            />
                                            {selectedItem && (
                                                <p className="text-[10px] text-muted-foreground">
                                                    {selectedRemaining} still
                                                    needed
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
                                                    value={
                                                        formState.pledge_amount ||
                                                        ''
                                                    }
                                                    onChange={e =>
                                                        updateField(
                                                            'pledge_amount',
                                                            e.target.value
                                                        )
                                                    }
                                                    className={`${inputClassName} pl-10`}
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
                                                        Suggested memo for
                                                        myvanco:
                                                    </span>{' '}
                                                    <span className="font-mono">
                                                        {
                                                            selectedItem.memoTemplate
                                                        }
                                                    </span>
                                                </span>
                                            </p>
                                        </div>
                                    )}
                                </>
                            )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {engagement.fields.map(field => (
                                <div
                                    key={field.id}
                                    className={`space-y-2 ${field.fullWidth ? 'sm:col-span-2' : ''}`}
                                >
                                    <label className="text-[11px] font-bold text-primary block">
                                        {field.label} {field.required && '*'}
                                    </label>
                                    {field.type === 'textarea' ? (
                                        <textarea
                                            required={field.required}
                                            value={formState[field.id] ?? ''}
                                            onChange={e =>
                                                updateField(
                                                    field.id,
                                                    e.target.value
                                                )
                                            }
                                            className={`${inputClassName} h-auto resize-none`}
                                            placeholder={
                                                field.placeholder ?? ''
                                            }
                                            rows={3}
                                        />
                                    ) : field.type === 'select' ? (
                                        <select
                                            required={field.required}
                                            value={formState[field.id] ?? ''}
                                            onChange={e =>
                                                updateField(
                                                    field.id,
                                                    e.target.value
                                                )
                                            }
                                            className={inputClassName}
                                        >
                                            <option value="">Select...</option>
                                            {field.options?.map(o => (
                                                <option
                                                    key={o.value}
                                                    value={o.value}
                                                >
                                                    {o.label}
                                                </option>
                                            ))}
                                        </select>
                                    ) : (
                                        <input
                                            type={field.type}
                                            required={field.required}
                                            value={formState[field.id] ?? ''}
                                            onChange={e =>
                                                updateField(
                                                    field.id,
                                                    e.target.value
                                                )
                                            }
                                            className={inputClassName}
                                            placeholder={
                                                field.placeholder ?? ''
                                            }
                                        />
                                    )}
                                </div>
                            ))}
                        </div>

                        {status === 'error' && (
                            <div className="rounded-xl bg-rose-50 border border-rose-200 p-4 text-sm text-rose-700">
                                {errorMessage}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={status === 'sending'}
                            className={`w-full ${
                                isPledge
                                    ? 'bg-accent hover:bg-accent/90 shadow-lg shadow-accent/20'
                                    : 'bg-primary hover:bg-primary/90 shadow-lg shadow-primary/10'
                            } disabled:opacity-60 py-6 text-sm font-bold uppercase tracking-widest text-white rounded-full transition-all flex items-center justify-center gap-2`}
                        >
                            {status === 'sending' ? (
                                <>
                                    <Loader2
                                        size={16}
                                        className="animate-spin"
                                    />{' '}
                                    Submitting...
                                </>
                            ) : isPledge ? (
                                <>
                                    <Heart size={16} /> Submit Pledge
                                </>
                            ) : (
                                'Submit'
                            )}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
