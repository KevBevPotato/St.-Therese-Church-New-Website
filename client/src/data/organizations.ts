// --- File: client/src/data/organizations.ts ---

export interface Officer {
    id: string;
    name: string;
    title: string;
    photo?: string;
    photoPosition?: string;
    email?: string;
    phone?: string;
    bio?: string;
}

export interface Member {
    id: string;
    name: string;
    photo?: string;
    photoPosition?: string;
    yearsAsMember?: number;
}

export interface Organization {
    id: string;
    name: string;
    tagline: string;
    description: string;
    audienceTag: "Men's" | "Women's";
    audience: string; // For display: "Men of the Parish" | "Women of the Parish"
    founded: number;
    meetingSchedule: string;
    room?: string;
    heroImage?: string;
    contactName: string;
    contactPhone: string;
    contactEmail?: string;
    stats: Array<{ label: string; value: string }>;
    officers: Officer[];
    members: Member[];
}

export const organizations: Organization[] = [
    {
        id: 'knights-of-columbus',
        name: 'Knights of Columbus',
        tagline: 'Charity, Unity, Fraternity, and Patriotism',
        description:
            'The Knights of Columbus is the world\'s largest Catholic fraternal service organization. Our local council serves Saint Thérèse parish through charitable works, faith formation support, and community fellowship. All Catholic men 18 and older are invited to join.',
        audienceTag: "Men's",
        audience: 'Catholic Men of the Parish',
        founded: 1900, // Replace with actual founding year of your council
        meetingSchedule: '2nd Monday of each month',
        room: 'BKC',
        contactName: 'Grand Knight',
        contactPhone: '(605) 867-5309',
        stats: [
            { label: 'Active Members', value: '60+' },
            { label: 'Years at Saint Thérèse', value: '50+' },
            { label: 'Charity Funds Raised', value: '$15K+' },
        ],
        officers: [
            {
                id: 'gk',
                name: '[Grand Knight Name]',
                title: 'Grand Knight',
                email: 'gk@kofc-sttherese.org',
            },
            {
                id: 'dgk',
                name: '[Deputy Grand Knight Name]',
                title: 'Deputy Grand Knight',
            },
            {
                id: 'chancellor',
                name: '[Chancellor Name]',
                title: 'Chancellor',
            },
            {
                id: 'recorder',
                name: '[Recorder Name]',
                title: 'Recorder',
            },
            {
                id: 'treasurer',
                name: '[Treasurer Name]',
                title: 'Treasurer',
            },
            {
                id: 'warden',
                name: '[Warden Name]',
                title: 'Warden',
            },
            {
                id: 'advocate',
                name: '[Advocate Name]',
                title: 'Advocate',
            },
            {
                id: 'chaplain',
                name: '[Chaplain Name]',
                title: 'Chaplain',
            },
        ],
        members: [
            // Add members here as photos/names come in
            { id: 'm1', name: 'Member Name 1' },
            { id: 'm2', name: 'Member Name 2' },
            { id: 'm3', name: 'Member Name 3' },
            // ... add more
        ],
    },
    {
        id: 'altar-society',
        name: 'Altar Society',
        tagline: 'Serving the Altar, Serving the Parish',
        description:
            'The Altar Society is a long-standing tradition at Saint Thérèse, where the women of the parish care for the sacred linens, altar vessels, flowers, and decorations of our church. It is a beautiful way to serve the Lord through care of His house.',
        audienceTag: "Women's",
        audience: 'Catholic Women of the Parish',
        founded: 1950, // Replace with actual founding year
        meetingSchedule: 'Quarterly',
        room: 'Room 103',
        contactName: 'President',
        contactPhone: '(605) 867-5309',
        stats: [
            { label: 'Active Members', value: '40+' },
            { label: 'Years at Saint Thérèse', value: '70+' },
            { label: 'Altars Cared For', value: '2' },
        ],
        officers: [
            {
                id: 'president',
                name: '[President Name]',
                title: 'President',
            },
            {
                id: 'vp',
                name: '[Vice President Name]',
                title: 'Vice President',
            },
            {
                id: 'secretary',
                name: '[Secretary Name]',
                title: 'Secretary',
            },
            {
                id: 'treasurer',
                name: '[Treasurer Name]',
                title: 'Treasurer',
            },
        ],
        members: [
            // Add members here as photos/names come in
            { id: 'm1', name: 'Member Name 1' },
            { id: 'm2', name: 'Member Name 2' },
        ],
    },
];

export function getOrganizationById(id: string): Organization | undefined {
    return organizations.find(o => o.id === id);
}
