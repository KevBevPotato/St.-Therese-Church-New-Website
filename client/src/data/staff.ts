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

// Force TypeScript to treat the imported JSON as 'any' so we can safely access .staff
const rawData = (staffDataModule as any).staff || (staffDataModule as any).default?.staff || [];

export const staffMembers = (rawData as any[]).map((member) => ({
    ...member,
    duties: member.duties || 'Serving the parish community with care and dedication.',
    bio: member.bio || 'More information about this ministry role will be shared soon.',
})) as StaffMember[];

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
