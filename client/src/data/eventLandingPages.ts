// client/src/data/eventLandingPages.ts

import { createElement, lazy, type ComponentType } from 'react';
import type { EventLandingPageProps } from '@/components/eventfolders/types';
import FaithFormation from '@/pages/FaithFormation';
import ConnectGroupsPage from '@/pages/ConnectGroupsPage';
export { canonicalizeEventId } from './eventIds';

/**
 * Maps an event ID prefix to a custom landing page component.
 *
 * Add a new prefix + component here as you build landing pages.
 * Events not in this map fall back to the generic EventDetail page.
 */

const PREFIXES_IN_PRIORITY_ORDER: string[] = [
    'daily-mass',
    'sunday-mass-9am',
    'sunday-mass-530pm',
    'saturday-vigil-mass',
    'mass-saturday',
    'mass-sunday-am',
    'mass-sunday-pm',
    'daily-rosary',
    'family-rosary',
    'adoration-confession',
    'holy-hour',
    'rosary-sun',
    'koc-officer',
    'koc-members',
    'family-formation',
    'wednesday-faith-formation',
    'connect-groups',
    'cinema-',
    'bookclub-',
    'rise-podcast',
];

const DailyRosary = lazy(() => import('@/pages/HomeEventPages/DailyRosary'));
const AdorationConfession = lazy(() => import('@/pages/HomeEventPages/AdorationConfession'));
const MassPage = lazy(() => import('@/pages/MassPage'));
const FaithFormationPage: ComponentType<EventLandingPageProps> = () =>
    createElement(FaithFormation);
const ConnectGroupsEventPage: ComponentType<EventLandingPageProps> = () =>
    createElement(ConnectGroupsPage);
const CinemaWithTheShepherd = lazy(() => import('@/pages/HomeEventPages/CinemaWithTheShepherd'));
const BishopBookclub = lazy(() => import('@/pages/HomeEventPages/BishopBookclub'));
const RisePodcast = lazy(() => import('@/pages/HomeEventPages/RisePodcast'));

const CUSTOM_PAGES: Record<string, ComponentType<EventLandingPageProps>> = {
    'daily-mass': MassPage,
    'sunday-mass-9am': MassPage,
    'sunday-mass-530pm': MassPage,
    'saturday-vigil-mass': MassPage,
    'mass-saturday': MassPage,
    'mass-sunday-am': MassPage,
    'mass-sunday-pm': MassPage,
    'daily-rosary': DailyRosary,
    'family-rosary': DailyRosary,
    'adoration-confession': AdorationConfession,
    'holy-hour': AdorationConfession,
    'wednesday-faith-formation': FaithFormationPage,
    'connect-groups': ConnectGroupsEventPage,
    'cinema-': CinemaWithTheShepherd,
    'bookclub-': BishopBookclub,
    'rise-podcast': RisePodcast,
};

export function getCustomLandingPage(
    eventId: string,
    organizationTags: readonly string[] = []
): ComponentType<EventLandingPageProps> | null {
    for (const prefix of PREFIXES_IN_PRIORITY_ORDER) {
        if (CUSTOM_PAGES[prefix] && eventId.startsWith(prefix)) {
            return CUSTOM_PAGES[prefix];
        }
    }
    if (organizationTags.includes('faith-formation')) {
        return FaithFormationPage;
    }
    return null;
}
