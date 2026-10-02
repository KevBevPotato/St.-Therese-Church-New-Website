import { useState } from 'react';
import { Link } from 'wouter';
import { Card } from '@/components/ui/card';
import ReactMarkdown from 'react-markdown';
import { Calendar, FileText, Phone, Mail, Filter, ExternalLink, ArrowLeft } from 'lucide-react';

export interface BulletinSection { id: string; label: string; content: string; }
export interface Bulletin { id: string; week: string; startDate: Date; endDate: Date; pdfUrl?: string; sections: BulletinSection[]; hasContent?: boolean; }
interface BulletinViewProps { bulletin: Bulletin; title: string; subtitle: string; backHref?: string; backLabel?: string; showEmptyPdfWarning?: boolean; emptyPdfMessage?: string; hideSectionsWithoutPdf?: boolean; }
interface ContactInfo { name: string; title: string; phone: string; email: string; }

const defaultContactInfo: ContactInfo = { name: 'Connie Heeren', title: 'Bulletin Coordinator', phone: '(605) 342-1556 Ext. 1', email: 'connie.heeren@strcstaff.org' };

// Separate function to handle the "Financial Ledger" look
function renderContributionSection(content: string) {
    return (
        <div className="space-y-1 text-sm">
            {content.split('\n').filter(line => line.trim() !== '').map((line, idx) => {
                const cleanLine = line.replace(/^- /, '').trim();
                if (cleanLine.toLowerCase().includes('total')) {
                    const [label, val] = cleanLine.split(':');
                    return (
                        <div key={idx} className="flex justify-between items-center py-2 font-bold text-primary border-t border-primary/20 mt-2">
                            <span>{label?.trim() || 'TOTAL'}</span>
                            <span className="text-red-600">{val?.trim() || ''}</span>
                        </div>
                    );
                }
                if (cleanLine.toLowerCase().includes('needed')) {
                    const [label, val] = cleanLine.split(':');
                    return (
                        <div key={idx} className="flex justify-between items-center py-2 font-bold text-primary border-t border-primary/20">
                            <span>{label?.trim() || 'NEEDED'}</span>
                            <span className="text-green-600">{val?.trim() || ''}</span>
                        </div>
                    );
                }
                const parts = cleanLine.split(':');
                if (parts.length >= 2) {
                    return (
                        <div key={idx} className="flex justify-between items-center pb-1 border-b border-gray-100 last:border-0">
                            <span className="text-muted-foreground">{parts[0].trim()}</span>
                            <span className="font-semibold text-primary">{parts.slice(1).join(':').trim()}</span>
                        </div>
                    );
                }
                return <p key={idx} className="text-xs italic">{cleanLine}</p>;
            })}
        </div>
    );
}

export default function BulletinView({ bulletin, title, subtitle, backHref, backLabel = "Back to Current Week's Bulletin", showEmptyPdfWarning = false, emptyPdfMessage = "Next week's bulletin not uploaded yet — check back Saturday morning at 12:00 AM.", hideSectionsWithoutPdf = false }: BulletinViewProps) {
    const [selectedSections, setSelectedSections] = useState<Set<string>>(new Set());
    const toggleSection = (id: string) => {
        const next = new Set(selectedSections);
        if (next.has(id)) next.delete(id); else next.add(id);
        setSelectedSections(next);
    };
    const selectAllSections = () => setSelectedSections(new Set(bulletin.sections.map(s => s.id)));
    const deselectAllSections = () => setSelectedSections(new Set());
    const hasPdf = !!bulletin.pdfUrl;
    const hasContent = bulletin.hasContent ?? true;
    const sectionsLocked = (hideSectionsWithoutPdf && !hasPdf) || !hasContent;

    return (
        <div className="space-y-8">
            {backHref && (
                <Link href={backHref} className="inline-flex items-center gap-2 text-primary hover:text-accent transition-colors font-bold text-sm uppercase tracking-widest">
                    <ArrowLeft size={16} /> {backLabel}
                </Link>
            )}
            <Card className="overflow-hidden border border-primary/12 rounded-3xl shadow-lg">
                <div className="bg-gradient-to-r from-primary/5 to-accent/5 p-8 border-b border-primary/10">
                    <p className="text-xs font-bold uppercase tracking-widest text-accent mb-2">{subtitle}</p>
                    <div className="flex flex-wrap items-center gap-4 mb-2">
                        <h2 className="font-serif text-3xl font-bold text-primary">{title}</h2>
                        {hasPdf && (
                            <a href={bulletin.pdfUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-accent hover:bg-accent/90 text-white px-5 py-2.5 rounded-full font-bold text-sm transition-all shadow-md hover:shadow-lg active:scale-95">
                                <ExternalLink size={16} /> View PDF
                            </a>
                        )}
                    </div>
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <Calendar size={16} /> {bulletin.week}
                    </p>
                </div>
                {showEmptyPdfWarning && !hasPdf && (
                    <div className="bg-amber-50 border-l-4 border-amber-400 p-6 m-8 rounded-lg">
                        <p className="text-sm text-amber-800 font-semibold flex items-center gap-2"><FileText size={16} /> {emptyPdfMessage}</p>
                    </div>
                )}
                {hideSectionsWithoutPdf && !hasPdf && (
                    <div className="m-8 rounded-lg border-l-4 border-amber-400 bg-amber-50 p-6">
                        <p className="flex items-center gap-2 text-sm font-semibold text-amber-800"><FileText size={16} /> The current bulletin has not been uploaded yet.</p>
                    </div>
                )}
                {bulletin.sections.length > 0 && (
                    <div className="flex flex-col">
                        <div className="p-8 border-b border-primary/10 bg-white">
                            <h3 className="font-serif text-2xl font-bold text-primary mb-6">Quick Search by Section</h3>
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2"><Filter size={18} className="text-primary/60" /><h4 className="font-bold text-primary text-sm uppercase tracking-widest">Filter Sections</h4></div>
                                <div className="flex gap-2">
                                    <button onClick={selectAllSections} disabled={sectionsLocked} className="text-xs font-bold text-accent hover:text-accent/80 uppercase tracking-widest disabled:opacity-40">Select All</button>
                                    <span className="text-primary/20">|</span>
                                    <button onClick={deselectAllSections} className="text-xs font-bold text-primary/60 hover:text-primary uppercase tracking-widest">Deselect All</button>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                {bulletin.sections.map(s => (
                                    <button key={s.id} onClick={() => toggleSection(s.id)} disabled={sectionsLocked} className={`px-3 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all border-2 ${selectedSections.has(s.id) ? 'bg-accent/15 border-accent text-accent shadow-sm' : 'bg-gray-50 border-gray-200 text-gray-400 hover:border-primary/30'}`}>{s.label}</button>
                                ))}
                            </div>
                        </div>
                        <div className="p-8 bg-white space-y-6">
                            {sectionsLocked ? (
                                <div className="py-12 text-center text-muted-foreground">
                                    <FileText className="mx-auto mb-3 size-10 text-primary/15" />
                                    <p className="text-sm font-bold uppercase tracking-widest">{hasContent ? 'Section information will appear when this bulletin is uploaded' : 'There is yet to be information added.'}</p>
                                </div>
                            ) : selectedSections.size === 0 ? (
                                <div className="text-center py-12 text-muted-foreground">
                                    <Filter className="size-10 text-primary/15 mx-auto mb-3" />
                                    <p className="text-sm font-bold uppercase tracking-widest">No sections selected — pick one above</p>
                                </div>
                            ) : (
                                bulletin.sections.filter(s => selectedSections.has(s.id)).map(s => (
                                    <div key={s.id} className="pb-6 border-b border-primary/5 last:border-0">
                                        <h4 className="font-bold text-primary mb-4 text-lg">{s.label}</h4>
                                        <div className="text-muted-foreground">
                                            {s.id === 'contributions' ? renderContributionSection(s.content) : (
                                                <div className="text-sm prose prose-sm max-w-none"><ReactMarkdown>{s.content}</ReactMarkdown></div>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </Card>
        </div>
    );
}

export { defaultContactInfo };
