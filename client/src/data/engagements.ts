/**
 * Engagement configuration — single source of truth for ALL engagement types.
 */

import { wnsWeeks, type SponsorshipItem } from '@/data/sponsorship-projects';

export type EngagementType = 'pledge' | 'signup' | 'suggestion' | 'referral';
export type SheetTab = 'Pledges' | 'Signups' | 'Suggestions' | 'Referrals';

export interface FormField {
    id: string;
    label: string;
    type: 'text' | 'email' | 'tel' | 'select' | 'number' | 'textarea';
    required: boolean;
    placeholder?: string;
    options?: Array<{ value: string; label: string }>;
    fullWidth?: boolean;
}

export interface EngagementConfig {
    id: string;
    type: EngagementType;
    sheetTab: SheetTab;
    title: string;
    subtitle: string;
    description: string;
    fields: FormField[];
    items?: SponsorshipItem[];     // For pledges only
    contextAware?: boolean;         // Auto-prefill from triggering opportunity
    thankYouMessage: string;
    skipSubmitterConfirmation?: boolean;
}

export const engagements: EngagementConfig[] = [
    // ===== PLEDGES =====

    {
        id: 'pledge-nursery',
        type: 'pledge',
        sheetTab: 'Pledges',
        title: 'Nursery',
        subtitle: 'Parish Council',
        description: 'Help us update the old side chapel into a nursery while retaining a space for mothers during Mass. Every gift brings us closer to a welcoming space for our youngest parishioners.',
        fields: [],
        items: [
            { id: 'pack-n-play',     label: "Pack 'n' Play",             quantityNeeded: 2, quantityFunded: 1, unitPrice: 80,  memoTemplate: "Nursery — Pack 'n' Play" },
            { id: 'rocking-chair',   label: 'Rocking Chair or Glider',   quantityNeeded: 1, quantityFunded: 0, unitPrice: 200, memoTemplate: 'Nursery — Rocking Chair or Glider' },
            { id: 'infant-bouncer',  label: 'Infant Bouncer',            quantityNeeded: 1, quantityFunded: 0, unitPrice: 90,  memoTemplate: 'Nursery — Infant Bouncer' },
            { id: 'children-books',  label: "Children's Books",          quantityNeeded: 5, quantityFunded: 0, unitPrice: 10,  memoTemplate: "Nursery — Children's Books" },
            { id: 'children-toys',   label: "Children's Toys",           quantityNeeded: 5, quantityFunded: 0, unitPrice: 15,  memoTemplate: "Nursery — Children's Toys" },
        ],
        thankYouMessage: 'Your pledge has been recorded. The parish office will follow up within 24 hours to coordinate payment via our secure system.',
    },

    {
        id: 'pledge-supper-week',
        type: 'pledge',
        sheetTab: 'Pledges',
        title: 'Wednesday Night Supper',
        subtitle: 'Sponsor a Week — $200',
        description: 'Sponsor one of our Wednesday Night Suppers by covering the cost of that meal for the parish community. Choose any un-sponsored week below.',
        fields: [],
        items: wnsWeeks, // dynamically generated
        thankYouMessage: 'Your sponsorship of a Wednesday Night Supper is deeply appreciated. The hospitality team will follow up to coordinate payment.',
    },

    // ===== SIGNUPS =====

    {
        id: 'signup-lector',
        type: 'signup',
        sheetTab: 'Signups',
        title: 'Lector Sign-up',
        subtitle: 'Liturgy Ministry',
        description: 'Proclaim the Scriptures and lead the Prayers of the Faithful during Mass. Training and ongoing scheduling support are provided for all new lectors.',
        contextAware: true,
        fields: [
            { id: 'from_name',  label: 'Full Name',                   type: 'text',  required: true,  placeholder: 'Your Full Name', fullWidth: true },
            { id: 'from_email', label: 'Email Address',               type: 'email', required: true },
            { id: 'from_phone', label: 'Phone (optional)',            type: 'tel',   required: false },
            {
                id: 'sunday_mass', label: 'Sunday Mass You Usually Attend', type: 'select', required: true, fullWidth: true,
                options: [
                    { value: 'Saturday 4:30 PM', label: 'Saturday 4:30 PM' },
                    { value: 'Sunday 9:00 AM', label: 'Sunday 9:00 AM' },
                    { value: 'Sunday 5:30 PM', label: 'Sunday 5:30 PM' },
                    { value: 'Varies', label: 'Varies / Different Each Week' },
                ],
            },
        ],
        thankYouMessage: 'The liturgy coordinator will reach out within a week to schedule training and your first reading.',
    },

    {
        id: 'signup-usher',
        type: 'signup',
        sheetTab: 'Signups',
        title: 'Usher Sign-up',
        subtitle: 'Liturgy Ministry',
        description: 'Ushers welcome parishioners, help people find seats in the pews, and assist with passing the offertory basket during Mass.',
        contextAware: true,
        fields: [
            { id: 'from_name',  label: 'Full Name',           type: 'text',  required: true,  placeholder: 'Your Full Name', fullWidth: true },
            { id: 'from_email', label: 'Email Address',       type: 'email', required: true },
            { id: 'from_phone', label: 'Phone (optional)',    type: 'tel',   required: false },
            {
                id: 'preferred_mass', label: 'Mass You Usually Attend', type: 'select', required: true, fullWidth: true,
                options: [
                    { value: 'Saturday 4:30 PM', label: 'Saturday 4:30 PM' },
                    { value: 'Sunday 9:00 AM', label: 'Sunday 9:00 AM' },
                    { value: 'Sunday 5:30 PM', label: 'Sunday 5:30 PM' },
                ],
            },
        ],
        thankYouMessage: 'You will be contacted with usher training details and your first scheduled Mass.',
    },

    {
        id: 'signup-music',
        type: 'signup',
        sheetTab: 'Signups',
        title: 'Music Ministry Sign-up',
        subtitle: 'Liturgy & Music Ministry',
        description: 'Help lead the parish in sung prayer. We welcome people interested in joining the choir, serving as an instrumentalist, or becoming a cantor.',
        contextAware: true,
        fields: [
            { id: 'from_name',  label: 'Full Name',           type: 'text',  required: true,  placeholder: 'Your Full Name', fullWidth: true },
            { id: 'from_email', label: 'Email Address',       type: 'email', required: true },
            { id: 'from_phone', label: 'Phone (optional)',    type: 'tel',   required: false },
            {
                id: 'interest', label: 'Which are you interested in?', type: 'select', required: true,
                options: [
                    { value: 'Choir', label: 'Choir' },
                    { value: 'Instrumentalist', label: 'Instrumentalist' },
                    { value: 'Cantor', label: 'Cantor' },
                ],
            },
            { id: 'experience', label: 'Tell us about your experience or musical background (optional)', type: 'textarea', required: false, fullWidth: true },
        ],
        thankYouMessage: 'Thank you for offering your talents to music ministry. The director will reach out soon.',
    },

    {
        id: 'signup-supper',
        type: 'signup',
        sheetTab: 'Signups',
        title: 'Wednesday Night Supper Volunteer',
        subtitle: 'Parish Hospitality',
        description: 'Help prepare and serve Wednesday Night Suppers throughout the school year. Pick a role and date.',
        contextAware: true,
        fields: [
            { id: 'from_name',  label: 'Full Name',           type: 'text',  required: true,  placeholder: 'Your Full Name', fullWidth: true },
            { id: 'from_email', label: 'Email Address',       type: 'email', required: true },
            { id: 'from_phone', label: 'Phone (optional)',    type: 'tel',   required: false },
            {
                id: 'preferred_date', label: 'Which Wednesday can you help? (optional)', type: 'text', required: false, fullWidth: true, placeholder: 'e.g. Wed, Sept 9',
            },
            {
                id: 'role_interest', label: 'Role', type: 'select', required: true, fullWidth: true,
                options: [
                    { value: 'Grocery Pick-up', label: 'Grocery Pick-up' },
                    { value: 'Food Prep', label: 'Food Prep' },
                    { value: 'Food Server', label: 'Food Server' },
                    { value: 'Clean-up Crew', label: 'Clean-up Crew' },
                    { value: 'Multiple / Any', label: 'Multiple / Any' },
                ],
            },
        ],
        thankYouMessage: 'Thank you for signing up. The hospitality coordinator will confirm the date with you soon.',
    },

    {
        id: 'signup-youth-mentor',
        type: 'signup',
        sheetTab: 'Signups',
        title: 'Youth Ministry Mentor',
        subtitle: 'Faith Formation',
        description: 'Guide high school students in their faith journey as a small-group leader.',
        contextAware: true,
        fields: [
            { id: 'from_name',  label: 'Full Name',           type: 'text',  required: true,  placeholder: 'Your Full Name', fullWidth: true },
            { id: 'from_email', label: 'Email Address',       type: 'email', required: true },
            { id: 'from_phone', label: 'Phone (optional)',    type: 'tel',   required: false },
            {
                id: 'role', label: 'Role', type: 'select', required: true, fullWidth: true,
                options: [
                    { value: 'High School Mentor', label: 'High School Mentor' },
                    { value: 'Retreat Chaperone', label: 'Retreat Chaperone' },
                ],
            },
        ],
        thankYouMessage: 'Thank you for volunteering. The youth ministry coordinator will reach out.',
    },

    {
        id: 'signup-nursery-help',
        type: 'signup',
        sheetTab: 'Signups',
        title: 'Nursery Volunteer',
        subtitle: 'Parish Council',
        description: 'Help us build and set up the new nursery space.',
        contextAware: true,
        fields: [
            { id: 'from_name',  label: 'Full Name',           type: 'text',  required: true,  placeholder: 'Your Full Name', fullWidth: true },
            { id: 'from_email', label: 'Email Address',       type: 'email', required: true },
            { id: 'from_phone', label: 'Phone (optional)',    type: 'tel',   required: false },
            {
                id: 'roles', label: 'How would you like to help?', type: 'select', required: true, fullWidth: true,
                options: [
                    { value: 'Construction Volunteer', label: 'Construction Volunteer' },
                    { value: 'Nursery Setup Helper', label: 'Nursery Setup Helper' },
                    { value: 'Both', label: 'Both / Either' },
                ],
            },
            { id: 'availability', label: 'When are you generally available? (optional)', type: 'textarea', required: false, fullWidth: true },
        ],
        thankYouMessage: 'Thank you for offering your time. The nursery coordinator will reach out with next steps.',
    },

    // ===== SUGGESTIONS =====

    {
        id: 'suggestion',
        type: 'suggestion',
        sheetTab: 'Suggestions',
        title: 'Suggestion',
        subtitle: 'Share your idea',
        description: 'Have an idea for the parish? A program we should start, a community need we should address, or a way to improve? We read every suggestion.',
        contextAware: true,
        fields: [
            { id: 'from_name',  label: 'Your Name',         type: 'text',     required: true,  placeholder: 'Your Name' },
            { id: 'from_email', label: 'Email Address',     type: 'email',    required: true },
            { id: 'from_phone', label: 'Phone (optional)',  type: 'tel',      required: false },
            {
                id: 'context_opportunity',
                label: 'About (Optional)',
                type: 'text',
                required: false,
                fullWidth: true,
                placeholder: 'If your suggestion is about a specific event or opportunity, please specify',
            },
            {
                id: 'suggestion',
                label: 'Your Suggestion',
                type: 'textarea',
                required: true,
                fullWidth: true,
                placeholder: 'Share your idea, observation, or recommendation...',
            },
        ],
        thankYouMessage: 'Thank you for taking the time to share. Our staff reviews suggestions regularly.',
    },

    // ===== REFERRALS =====

    {
        id: 'referral',
        type: 'referral',
        sheetTab: 'Referrals',
        title: 'Refer a Friend',
        subtitle: 'Know someone who would be a great fit?',
        description: 'Do you know someone who would be a good fit for this ministry? Share their contact info and we will reach out personally.',
        contextAware: true,
        fields: [
            {
                id: 'their_name', label: 'Their Name', type: 'text', required: true,
                placeholder: 'Name of person you are referring', fullWidth: true,
            },
            {
                id: 'their_phone', label: 'Their Phone Number', type: 'tel', required: true,
                placeholder: '(605) 000-0000', fullWidth: true,
            },
            {
                id: 'your_name', label: 'Your Name', type: 'text', required: false,
                placeholder: 'Your name', fullWidth: true,
            },
            {
                id: 'your_phone', label: 'Your Phone Number', type: 'tel', required: false,
                placeholder: '(605) 000-0000', fullWidth: true,
            },
            {
                id: 'opportunity',
                label: 'Opportunity',
                type: 'text',
                required: false,
                fullWidth: true,
                placeholder: 'Which opportunity? (auto-filled if you clicked from a card)',
            },
        ],
        thankYouMessage: '',
        skipSubmitterConfirmation: true,
    },
];

export function getEngagementById(id: string): EngagementConfig | undefined {
    return engagements.find(e => e.id === id);
}

export function getEngagementsByType(type: EngagementType): EngagementConfig[] {
    return engagements.filter(e => e.type === type);
}
