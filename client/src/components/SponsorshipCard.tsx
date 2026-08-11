import { useState } from 'react';
import { Link } from 'wouter';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Building2,
    CheckCircle2,
    ChevronDown,
    ChevronUp,
    Circle,
    Phone,
    User,
    UserPlus,
    MessageSquare,
    Heart,
} from 'lucide-react';
import PledgeModal from './PledgeModal';
import {
    type SponsorshipProject,
    getItemsForProject,
    itemFundedLabel,
} from '@/data/sponsorship-projects';

interface SponsorshipCardProps {
    project: SponsorshipProject;
    onSignUpVolunteer: (projectId: string) => void;
    onRefer: (projectId: string) => void;
    onSuggestion: (projectId: string) => void;
}

export default function SponsorshipCard({
    project,
    onSignUpVolunteer,
    onRefer,
    onSuggestion,
}: SponsorshipCardProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isPledgeOpen, setIsPledgeOpen] = useState(false);
    const [defaultItemId, setDefaultItemId] = useState<string | undefined>(undefined);

    const itemsWithRemaining = getItemsForProject(project.id);
    const totalNeeded = itemsWithRemaining.reduce((sum, i) => sum + i.quantityNeeded, 0);
    const totalFunded = itemsWithRemaining.reduce((sum, i) => sum + i.quantityFunded, 0);
    const totalRemaining = Math.max(totalNeeded - totalFunded, 0);
    const fundingPct = totalNeeded > 0 ? (totalFunded / totalNeeded) * 100 : 0;

    // === Dollar-amount totals for the progress bar ===
    const goalAmount = project.items.reduce(
        (sum, item) => sum + (item.unitPrice ?? 0) * item.quantityNeeded,
        0
    );
    const fundedAmount = project.items.reduce(
        (sum, item) => sum + (item.unitPrice ?? 0) * item.quantityFunded,
        0
    );
    const remainingAmount = Math.max(goalAmount - fundedAmount, 0);
    const amountPct = goalAmount > 0 ? (fundedAmount / goalAmount) * 100 : 0;

    const volunteerRolesTotalNeeded = project.volunteerRoles?.reduce((sum, r) => sum + r.needed, 0) ?? 0;
    const volunteerRolesTotalFilled = project.volunteerRoles?.reduce((sum, r) => sum + r.filled, 0) ?? 0;

    const handlePledgeForItem = (itemId: string) => {
        setDefaultItemId(itemId);
        setIsPledgeOpen(true);
    };

    return (
        <>
            <Card className="group flex flex-col border-2 border-primary/5 hover:border-primary/20 transition-all duration-300 overflow-hidden bg-white shadow-sm hover:shadow-xl">
                <div className="p-8 pb-4 flex-grow">
                    <div className="flex justify-between items-start mb-4 gap-3">
                        <div className="flex flex-wrap gap-1">
                            <span className="text-[8px] font-black uppercase tracking-widest px-2 py-0.5 bg-accent/10 text-accent rounded-full border border-accent/10">
                                Sponsorship
                            </span>
                            <span className="text-[8px] font-black uppercase tracking-widest px-2 py-0.5 bg-primary/10 text-primary rounded-full border border-primary/10">
                                Family
                            </span>
                        </div>
                        {project.organization && (
                            <span className="shrink-0 flex items-center gap-1 text-[9px] font-bold text-primary/40 uppercase tracking-widest">
                                <Building2 size={10} /> {project.organization}
                            </span>
                        )}
                    </div>

                    <Link href={`/get-involved/${project.id}`}>
                        <a className="block mb-3 group/title">
                            <h3 className="font-serif text-2xl font-bold text-primary leading-tight group-hover/title:text-accent transition-colors cursor-pointer">
                                {project.title}
                            </h3>
                        </a>
                    </Link>

                    <div className="mb-6 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                    <User size={14} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-primary">{project.contactName}</p>
                                    <p className="text-[10px] text-muted-foreground">{project.contactPhone}</p>
                                </div>
                            </div>
                            <a
                                href={`tel:${project.contactPhone.replace(/\D/g, '')}`}
                                className="p-2 text-primary/40 hover:text-accent transition-colors"
                                aria-label={`Call ${project.contactName}`}
                            >
                                <Phone size={14} />
                            </a>
                        </div>
                    </div>

                    <p className="text-muted-foreground leading-relaxed text-sm mb-6">
                        {project.description}
                    </p>

                    <div className="space-y-4 mb-2">
                        {/* === DOLLAR-AMOUNT PROGRESS BAR === */}
                        {goalAmount > 0 ? (
                            <div className="space-y-2">
                                <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-primary/60">
                                    <span>Funding Progress</span>
                                    <span>
                                        ${fundedAmount.toLocaleString()} of ${goalAmount.toLocaleString()}
                                    </span>
                                </div>
                                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-amber-400 transition-all"
                                        style={{ width: `${Math.min(amountPct, 100)}%` }}
                                    />
                                </div>
                                {remainingAmount === 0 ? (
                                    <p className="text-[10px] font-bold text-green-600">
                                        All items fully funded!
                                    </p>
                                ) : (
                                    <p className="text-[10px] font-bold text-amber-600">
                                        ${remainingAmount.toLocaleString()} still needed
                                    </p>
                                )}
                            </div>
                        ) : (
                            // Fallback to count-based if no prices set
                            <div className="space-y-2">
                                <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-primary/60">
                                    <span>Items Progress</span>
                                    <span>{totalFunded} of {totalNeeded} items funded</span>
                                </div>
                                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-amber-400 transition-all"
                                        style={{ width: `${Math.min(fundingPct, 100)}%` }}
                                    />
                                </div>
                            </div>
                        )}

                        {project.volunteerRoles && project.volunteerRoles.length > 0 && (
                            <div className="space-y-2">
                                <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-primary/60">
                                    <span>Volunteers</span>
                                    <span>
                                        {volunteerRolesTotalFilled} of {volunteerRolesTotalNeeded} Roles Filled
                                    </span>
                                </div>
                                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-rose-400 transition-all"
                                        style={{
                                            width: volunteerRolesTotalNeeded > 0
                                                ? `${(volunteerRolesTotalFilled / volunteerRolesTotalNeeded) * 100}%`
                                                : '0%',
                                        }}
                                    />
                                </div>
                            </div>
                        )}

                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-primary hover:text-accent transition-colors"
                        >
                            {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                            {isExpanded ? 'Hide Details' : 'View Items & Roles'}
                        </button>

                        {isExpanded && (
                            <div className="pt-4 space-y-4 animate-in slide-in-from-top-2 duration-300 border-t border-gray-100">
                                <div className="space-y-2">
                                    <h4 className="text-[10px] font-bold text-primary uppercase tracking-widest">
                                        Items Needed
                                    </h4>
                                    {itemsWithRemaining.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex items-center justify-between text-[11px] py-2 border-b border-gray-50 last:border-0 gap-3"
                                        >
                                            <div className="flex items-center gap-2 flex-1 min-w-0">
                                                {item.isFullyFunded ? (
                                                    <CheckCircle2 size={12} className="text-green-500 flex-shrink-0" />
                                                ) : (
                                                    <Circle size={12} className="text-gray-200 flex-shrink-0" />
                                                )}
                                                <span
                                                    className={
                                                        item.isFullyFunded
                                                            ? 'text-muted-foreground line-through truncate'
                                                            : 'text-primary truncate'
                                                    }
                                                >
                                                    {itemFundedLabel(item)}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 flex-shrink-0">
                                                {item.unitPrice && (
                                                    <span className="font-bold text-primary/60">${item.unitPrice}</span>
                                                )}
                                                {!item.isFullyFunded && (
                                                    <button
                                                        type="button"
                                                        onClick={() => handlePledgeForItem(item.id)}
                                                        className="text-[10px] font-bold text-accent hover:text-accent/80 uppercase tracking-widest"
                                                    >
                                                        Pledge
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {project.constructionItems && project.constructionItems.length > 0 && (
                                    <div className="space-y-2 pt-2 border-t border-gray-100">
                                        <h4 className="text-[10px] font-bold text-primary uppercase tracking-widest">
                                            Construction Materials
                                        </h4>
                                        {project.constructionItems.map((category) => (
                                            <div
                                                key={category.category}
                                                className="flex items-center justify-between text-[10px] py-1"
                                            >
                                                <span className="font-semibold text-primary">{category.category}</span>
                                                <span className="font-bold text-primary/60">{category.subtotal}</span>
                                            </div>
                                        ))}
                                        <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px]">
                                            <span className="font-bold text-primary">Estimated Total</span>
                                            <span className="font-bold text-accent">{project.constructionTotal}</span>
                                        </div>
                                    </div>
                                )}

                                {project.volunteerRoles && project.volunteerRoles.length > 0 && (
                                    <div className="space-y-2 pt-2 border-t border-gray-100">
                                        <h4 className="text-[10px] font-bold text-primary uppercase tracking-widest">
                                            Volunteer Roles
                                        </h4>
                                        {project.volunteerRoles.map((role) => (
                                            <div
                                                key={role.name}
                                                className="flex items-center justify-between text-[11px] py-1 border-b border-gray-50 last:border-0"
                                            >
                                                <span className="text-primary">{role.name}</span>
                                                <span className="font-bold text-primary/60">
                                                    {Math.max(role.needed - role.filled, 0)} still needed
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div className="p-8 pt-2 space-y-3">
                    <Button
                        onClick={() => setIsPledgeOpen(true)}
                        className="w-full bg-accent hover:bg-accent/90 text-white font-bold uppercase tracking-[0.2em] text-[10px] py-6 shadow-lg shadow-accent/20"
                    >
                        <Heart size={14} className="mr-2" /> Contribute to {project.title}
                    </Button>

                    <Button
                        onClick={() => onSignUpVolunteer(project.id)}
                        variant="outline"
                        className="w-full text-primary font-bold uppercase tracking-[0.1em] text-[9px] py-4 border-primary/30 hover:border-primary bg-white hover:bg-white"
                    >
                        Sign Up to Help
                    </Button>

                    <div className="grid grid-cols-2 gap-2">
                        <Button
                            variant="outline"
                            onClick={() => onSuggestion(project.id)}
                            className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest py-4 border-primary/10 hover:border-primary/30"
                        >
                            <MessageSquare size={12} /> Suggestion
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => onRefer(project.id)}
                            className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest py-4 border-primary/10 hover:border-primary/30"
                        >
                            <UserPlus size={12} /> Refer
                        </Button>
                    </div>
                </div>
            </Card>

            <PledgeModal
                isOpen={isPledgeOpen}
                onClose={() => {
                    setIsPledgeOpen(false);
                    setDefaultItemId(undefined);
                }}
                projectId={project.id}
                projectTitle={project.title}
                items={project.items}
                defaultItemId={defaultItemId}
            />
        </>
    );
}
