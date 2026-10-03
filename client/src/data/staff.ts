import * as staffDataModule from './staff_data.json';

export interface StaffMember {
    slug: string;
    name: string;
    titles: string[];
    email?: string;
    phone?: string;
    officeRoom?: string;
    categories: Array<'clergy' | 'staff' | 'catechist' | 'council' | 'music' | 'ministries'>;
    photo?: string;
    photoPosition?: string;
    photoFit?: 'cover' | 'contain';
    duties?: string;
    bio?: string;
}

const rawData = (staffDataModule as any).staff || (staffDataModule as any).default?.staff || [];

export const staffMembers = (rawData as any[]).map((member) => {
    // FLATTENING LOGIC: 
    // If titles is an array of objects [{title: 'Pastor'}], turn it into ['Pastor']
    const flattenedTitles = Array.isArray(member.titles)
        ? member.titles.map((t: any) => typeof t === 'object' ? t.title : t)
        : [];

    // If categories is an array of objects [{category: 'staff'}], turn it into ['staff']
    const flattenedCategories = Array.isArray(member.categories)
        ? member.categories.map((c: any) => typeof c === 'object' ? c.category : c)
        : [];

    return {
        ...member,
        titles: flattenedTitles,
        categories: flattenedCategories,
        duties: member.duties || 'Serving the parish community with care and dedication.',
        bio: member.bio || 'More information about this ministry role will be shared soon.',
    };
}) as StaffMember[];

export const staffCategories = [
    { id: 'all', label: 'All Personnel' },
    { id: 'clergy', label: 'Clergy' },
    { id: 'staff', label: 'Staff' },
    { id: 'catechist', label: 'Catechists' },
    { id: 'council', label: 'Parish Council' },
    { id: 'music', label: 'Music Ministry' },
    { id: 'ministries', label: 'Other Ministries' },
] as const;

export const getStaffBySlug = (slug: string) =>
    staffMembers.find((m) => m.slug === slug);
