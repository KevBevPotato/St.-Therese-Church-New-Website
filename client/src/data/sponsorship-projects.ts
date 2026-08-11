/**
 * Sponsorship projects data.
 *
 * Edit this file when:
 *   - A payment is received: increment `quantityFunded` on the item
 *   - New items are needed: add to the items array
 *   - An item is fully funded: set quantityFunded === quantityNeeded
 *
 * Phase 2 (future):
 *   - myvanco webhook integration will replace manual updates
 */

export interface SponsorshipItem {
    id: string;
    label: string;
    quantityNeeded: number;
    quantityFunded: number;
    unitPrice?: number;
    memoTemplate: string;
    date?: string;
}

export interface ConstructionItemCategory {
    category: string;
    items: { name: string; cost: string }[];
    subtotal: string;
}

export interface VolunteerRole {
    name: string;
    needed: number;
    filled: number;
}

export interface SponsorshipProject {
    id: string;
    title: string;
    description: string;
    organization?: string;
    contactName: string;
    contactPhone: string;
    items: SponsorshipItem[];
    constructionItems?: ConstructionItemCategory[];
    constructionTotal?: string;
    volunteerRoles?: VolunteerRole[];
}

/**
 * Generate Wednesday Night Supper week items as pledge targets.
 * Each Wednesday is a unique sponsorship opportunity at $200.
 */
function generateWednesdaySupperWeeks(): SponsorshipItem[] {
    const items: SponsorshipItem[] = [];
    const start = new Date(2026, 8, 2);    // Sept 2, 2026 (Wednesday)
    const end = new Date(2027, 4, 19);     // May 19, 2027
    const excluded = new Set([
        '2026-11-25',                       // Thanksgiving week
        '2026-12-23',                       // Christmas week
        '2026-12-30',                       // New Year's week
        '2027-03-31',                       // Holy Week
    ]);

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 7)) {
        const isoDate = d.toISOString().split('T')[0];
        if (excluded.has(isoDate)) continue;

        const label = d.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
        });

        items.push({
            id: `wns-${isoDate}`,
            label: `Wed, ${label}`,
            quantityNeeded: 1,
            quantityFunded: 0,
            unitPrice: 200,
            memoTemplate: `WNS — ${label} ${d.getFullYear()}`,
            date: isoDate,
        });
    }
    return items;
}

export const wnsWeeks: SponsorshipItem[] = generateWednesdaySupperWeeks();

export const sponsorshipProjects: SponsorshipProject[] = [
    {
        id: 'nursery',
        title: 'Nursery',
        organization: 'Parish Council',
        contactName: 'Kelly Whartman',
        contactPhone: '(605) 867-5309',
        description:
            'We are looking to update the old side chapel into a nursery while retaining a space for mothers during Mass. Donations and volunteers are welcome.',
        items: [
            { id: 'pack-n-play', label: "Pack 'n' Play", quantityNeeded: 2, quantityFunded: 1, unitPrice: 80, memoTemplate: "Nursery — Pack 'n' Play" },
            { id: 'rocking-chair', label: 'Rocking Chair or Glider', quantityNeeded: 1, quantityFunded: 0, unitPrice: 200, memoTemplate: 'Nursery — Rocking Chair or Glider' },
            { id: 'infant-bouncer', label: 'Infant Bouncer', quantityNeeded: 1, quantityFunded: 0, unitPrice: 90, memoTemplate: 'Nursery — Infant Bouncer' },
            { id: 'children-books', label: "Children's Books", quantityNeeded: 5, quantityFunded: 0, unitPrice: 10, memoTemplate: "Nursery — Children's Books" },
            { id: 'children-toys', label: "Children's Toys", quantityNeeded: 5, quantityFunded: 0, unitPrice: 15, memoTemplate: "Nursery — Children's Toys" },
        ],
        constructionItems: [
            { category: '2x4 Lumber & Construction Screws', items: [{ name: '2x4 Lumber & Construction Screws', cost: '$79.30' }], subtotal: '$79.30' },
            { category: 'Sheetrock & Drywall Screws', items: [{ name: 'Sheetrock & Drywall Screws', cost: '$131.50' }], subtotal: '$131.50' },
            { category: 'Mudding, Tape & Sanding Supplies', items: [{ name: 'Mudding, Tape & Sanding Supplies', cost: '$31.50' }], subtotal: '$31.50' },
        ],
        constructionTotal: '~$242.30',
        volunteerRoles: [
            { name: 'Construction Volunteers', needed: 8, filled: 0 },
            { name: 'Nursery Setup Helpers', needed: 4, filled: 0 },
        ],
    },
];

export function getItemsForProject(projectId: string) {
    // Special case: WNS uses dynamically generated weeks
    if (projectId === 'supper-week') return wnsWeeks.map(item => ({ ...item, remaining: Math.max(item.quantityNeeded - item.quantityFunded, 0), isFullyFunded: item.quantityFunded >= item.quantityNeeded }));
    const project = sponsorshipProjects.find(p => p.id === projectId);
    if (!project) return [];
    return project.items.map(item => ({
        ...item,
        remaining: Math.max(item.quantityNeeded - item.quantityFunded, 0),
        isFullyFunded: item.quantityFunded >= item.quantityNeeded,
    }));
}

export function itemFundedLabel(item: SponsorshipItem): string {
    if (item.quantityFunded >= item.quantityNeeded) {
        return `${item.label}: Sponsored!`;
    }
    return item.label;
}

export function itemRemainingLabel(item: SponsorshipItem): string {
    if (item.quantityFunded >= item.quantityNeeded) {
        return `${item.label}: Sponsored!`;
    }
    return `${item.label}: Available`;
}
