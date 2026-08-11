import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Calendar,
    Users,
    BookOpen,
    X,
    FileText,
    MapPin,
    Phone,
    User,
    Heart
} from 'lucide-react';

/**
 * Faith Formation Page
 * Features:
 * - Registration form for all age groups
 * - Grade-specific event cards (Preschool through 12th Grade + Adult)
 * - All programs on Wednesdays 6:00 PM - 7:30 PM
 * - Hero section with Church Map PDF link
 * - Filter system with "All Programs" and "Deselect All"
 */

type AgeCategory = 'prek-5th' | 'middle-school' | 'high-school' | 'adult';

interface ChildData {
    fullName: string;
    preferredName: string;
    school: string;
    phone: string;
    sacraments: {
        baptism: boolean;
        firstCommunion: boolean;
        confession: boolean;
        confirmation: boolean;
    };
    contactPreference: 'email' | 'text';
}

interface FormData {
    numberOfChildren: number;
    children: ChildData[];
    fatherFullName: string;
    fatherReligion: string;
    fatherCell: string;
    fatherEmail: string;
    fatherContactPreference: 'email' | 'text';
    motherFullName: string;
    motherReligion: string;
    motherCell: string;
    motherEmail: string;
    motherContactPreference: 'email' | 'text';
    streetAddress: string;
    city: string;
    state: string;
    zipCode: string;
    isMember: string;
    massAttendance: string;
    tuitionOption: 'per-child' | 'family';
    tuitionPaid: string;
    needsFinancialAssistance: boolean;
    specialNeeds: string;
}

interface FaithEvent {
    id: string;
    title: string;
    ageCategory: AgeCategory;
    description: string;
    dayTime: string;
    location: string;
    contactName: string;
    contactPhone: string;
}

const faithEvents: FaithEvent[] = [
    {
        id: 'preschool',
        title: 'Preschool',
        ageCategory: 'prek-5th',
        description: 'Introduction to faith through songs, stories, and activities for our youngest learners.',
        dayTime: 'Wednesdays 6:00 PM - 7:30 PM',
        location: 'Parish Hall - Room A',
        contactName: 'Kevin Baltzer',
        contactPhone: ''
    },
    {
        id: 'kindergarten',
        title: 'Kindergarten',
        ageCategory: 'prek-5th',
        description: 'Exploring God\'s creation and basic Catholic prayers in a fun, engaging environment.',
        dayTime: 'Wednesdays 6:00 PM - 7:30 PM',
        location: 'Parish Hall - Room B',
        contactName: 'Kevin Baltzer',
        contactPhone: ''
    },
    {
        id: '1st-grade',
        title: '1st Grade',
        ageCategory: 'prek-5th',
        description: 'Building a foundation of faith and learning about the life of Jesus.',
        dayTime: 'Wednesdays 6:00 PM - 7:30 PM',
        location: 'Parish Hall - Room C',
        contactName: 'Kevin Baltzer',
        contactPhone: ''
    },
    {
        id: '2nd-grade',
        title: '2nd Grade',
        ageCategory: 'prek-5th',
        description: 'Sacramental preparation for First Reconciliation and First Holy Communion.',
        dayTime: 'Wednesdays 6:00 PM - 7:30 PM',
        location: 'Parish Hall - Room D',
        contactName: 'Kevin Baltzer',
        contactPhone: ''
    },
    {
        id: '3rd-grade',
        title: '3rd Grade',
        ageCategory: 'prek-5th',
        description: 'Deepening understanding of the Church community and the Holy Spirit.',
        dayTime: 'Wednesdays 6:00 PM - 7:30 PM',
        location: 'Parish Hall - Room E',
        contactName: 'Kevin Baltzer',
        contactPhone: ''
    },
    {
        id: '4th-grade',
        title: '4th Grade',
        ageCategory: 'prek-5th',
        description: 'Learning about the Ten Commandments and living a moral life.',
        dayTime: 'Wednesdays 6:00 PM - 7:30 PM',
        location: 'Parish Hall - Room F',
        contactName: 'Kevin Baltzer',
        contactPhone: ''
    },
    {
        id: '5th-grade',
        title: '5th Grade',
        ageCategory: 'prek-5th',
        description: 'Exploring the seven Sacraments and their importance in our spiritual journey.',
        dayTime: 'Wednesdays 6:00 PM - 7:30 PM',
        location: 'Parish Hall - Room G',
        contactName: 'Kevin Baltzer',
        contactPhone: ''
    },
    {
        id: '6th-grade',
        title: '6th Grade',
        ageCategory: 'middle-school',
        description: 'Introduction to the Old Testament and God\'s covenant with His people.',
        dayTime: 'Wednesdays 6:00 PM - 7:30 PM',
        location: 'Parish Hall - Room H',
        contactName: 'Bobby Myers',
        contactPhone: ''
    },
    {
        id: '7th-grade',
        title: '7th Grade',
        ageCategory: 'middle-school',
        description: 'Exploring the New Testament and the mission of the early Church.',
        dayTime: 'Wednesdays 6:00 PM - 7:30 PM',
        location: 'Parish Hall - Room I',
        contactName: 'Bobby Myers',
        contactPhone: ''
    },
    {
        id: '8th-grade',
        title: '8th Grade',
        ageCategory: 'middle-school',
        description: 'Preparation for the Sacrament of Confirmation and life as a disciple.',
        dayTime: 'Wednesdays 6:00 PM - 7:30 PM',
        location: 'Parish Hall - Room J',
        contactName: 'Bobby Myers',
        contactPhone: ''
    },
    {
        id: '9th-grade',
        title: '9th Grade',
        ageCategory: 'high-school',
        description: 'Navigating high school with faith and building a personal relationship with Christ.',
        dayTime: 'Wednesdays 6:00 PM - 7:30 PM',
        location: 'Parish Hall - Youth Room',
        contactName: 'Jane Doe',
        contactPhone: ''
    },
    {
        id: '10th-grade',
        title: '10th Grade',
        ageCategory: 'high-school',
        description: 'Understanding Catholic social teaching and serving the community.',
        dayTime: 'Wednesdays 6:00 PM - 7:30 PM',
        location: 'Parish Hall - Youth Room',
        contactName: 'Jane Doe',
        contactPhone: ''
    },
    {
        id: '11th-grade',
        title: '11th Grade',
        ageCategory: 'high-school',
        description: 'Deepening prayer life and discernment of God\'s will for the future.',
        dayTime: 'Wednesdays 6:00 PM - 7:30 PM',
        location: 'Parish Hall - Youth Room',
        contactName: 'Jane Doe',
        contactPhone: ''
    },
    {
        id: '12th-grade',
        title: '12th Grade',
        ageCategory: 'high-school',
        description: 'Preparing for life after graduation as a committed Catholic adult.',
        dayTime: 'Wednesdays 6:00 PM - 7:30 PM',
        location: 'Parish Hall - Youth Room',
        contactName: 'Jane Doe',
        contactPhone: ''
    },
    {
        id: 'adult',
        title: 'Adult Faith Formation',
        ageCategory: 'adult',
        description: 'Continuing education in faith, scripture study, and spiritual growth for adults.',
        dayTime: 'Wednesdays 6:00 PM - 7:30 PM',
        location: 'Parish Hall - Library',
        contactName: 'Fr. Mark McCormick',
        contactPhone: ''
    },
];

const ageCategories: { id: AgeCategory; label: string }[] = [
    { id: 'prek-5th', label: 'Pre-K to 5th Grade' },
    { id: 'middle-school', label: 'Middle School' },
    { id: 'high-school', label: 'High School' },
    { id: 'adult', label: 'Adult' },
];

const defaultChildData: ChildData = {
    fullName: '',
    preferredName: '',
    school: '',
    phone: '',
    sacraments: {
        baptism: false,
        firstCommunion: false,
        confession: false,
        confirmation: false,
    },
    contactPreference: 'email',
};

export default function FaithFormation() {
    const [selectedCategories, setSelectedCategories] = useState<Set<AgeCategory | 'all'>>(new Set(['all']));
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState<FormData>({
        numberOfChildren: 1,
        children: [{ ...defaultChildData }],
        fatherFullName: '',
        fatherReligion: '',
        fatherCell: '',
        fatherEmail: '',
        fatherContactPreference: 'email',
        motherFullName: '',
        motherReligion: '',
        motherCell: '',
        motherEmail: '',
        motherContactPreference: 'email',
        streetAddress: '',
        city: '',
        state: '',
        zipCode: '',
        isMember: '',
        massAttendance: '',
        tuitionOption: 'per-child',
        tuitionPaid: '',
        needsFinancialAssistance: false,
        specialNeeds: '',
    });

    const toggleCategory = (catId: AgeCategory | 'all') => {
        const newSelected = new Set(selectedCategories);
        if (catId === 'all') {
            setSelectedCategories(new Set(['all']));
            return;
        }

        if (newSelected.has('all')) {
            newSelected.delete('all');
        }

        if (newSelected.has(catId)) {
            newSelected.delete(catId);
            if (newSelected.size === 0) {
                newSelected.add('all');
            }
        } else {
            newSelected.add(catId);
        }
        setSelectedCategories(newSelected);
    };

    const deselectAll = () => {
        setSelectedCategories(new Set());
    };

    const filteredEvents = faithEvents.filter(event => {
        if (selectedCategories.has('all')) return true;
        if (selectedCategories.size === 0) return false;
        return selectedCategories.has(event.ageCategory);
    });

    const tuitionCost = (() => {
        const isMember = formData.isMember === 'Yes';
        const numChildren = formData.numberOfChildren;
        if (formData.tuitionOption === 'family') {
            return isMember ? 50 : 100;
        } else {
            return isMember ? 25 * numChildren : 50 * numChildren;
        }
    })();

    const handleNumberOfChildrenChange = (num: number) => {
        const newChildren = [...formData.children];
        if (num > formData.numberOfChildren) {
            for (let i = formData.numberOfChildren; i < num; i++) {
                newChildren.push({ ...defaultChildData });
            }
        } else {
            newChildren.splice(num);
        }
        setFormData(prev => ({
            ...prev,
            numberOfChildren: num,
            children: newChildren
        }));
    };

    const handleChildChange = (childIndex: number, field: keyof ChildData, value: any) => {
        const newChildren = [...formData.children];
        if (field === 'sacraments') {
            newChildren[childIndex].sacraments = value;
        } else {
            newChildren[childIndex][field] = value;
        }
        setFormData(prev => ({
            ...prev,
            children: newChildren
        }));
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            setFormData(prev => ({
                ...prev,
                [name]: (e.target as HTMLInputElement).checked
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setTimeout(() => {
            alert(`Thank you for registering! Total cost due: $${tuitionCost}. We will contact you soon with more information.`);
            setIsSubmitting(false);
            setIsFormOpen(false);
            setFormData({
                numberOfChildren: 1,
                children: [{ ...defaultChildData }],
                fatherFullName: '',
                fatherReligion: '',
                fatherCell: '',
                fatherEmail: '',
                fatherContactPreference: 'email',
                motherFullName: '',
                motherReligion: '',
                motherCell: '',
                motherEmail: '',
                motherContactPreference: 'email',
                streetAddress: '',
                city: '',
                state: '',
                zipCode: '',
                isMember: '',
                massAttendance: '',
                tuitionOption: 'per-child',
                tuitionPaid: '',
                needsFinancialAssistance: false,
                specialNeeds: '',
            });
        }, 1000);
    };

    return (
        <div className="min-h-screen flex flex-col bg-[#fbfaf6]">
            <Header />
            <div className="pt-[69px]" />

            {/* Hero Section */}
            <section className="relative overflow-hidden border-b border-primary/10 bg-[#fbfaf6] py-16 md:py-20">
                <div className="absolute -right-20 -top-24 size-80 rounded-full bg-[#b8954f]/10 blur-3xl" aria-hidden="true" />
                <div className="container relative grid gap-10 md:grid-cols-[1.18fr_0.82fr] md:items-end mx-auto px-4">
                    <div>
                        <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-[#9b762f]"><BookOpen className="size-4" aria-hidden="true" /> Growing in Faith</p>
                        <h1 className="mt-4 max-w-3xl font-serif text-5xl font-bold leading-[0.98] text-primary md:text-7xl">Faith Formation Programs</h1>
                        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">Nurturing faith at every stage of life. From young children to adults, discover programs designed to deepen your relationship with Christ and our parish community.</p>

                        <div className="flex flex-wrap gap-4 mt-8">
                            <Button
                                onClick={() => setIsFormOpen(true)}
                                className="bg-accent hover:bg-accent/90 text-white px-8 py-6 font-bold uppercase tracking-widest shadow-lg"
                            >
                                Register Here
                            </Button>
                            <a
                                href="/ChurchMap.pdf"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 bg-white border-2 border-primary/10 hover:border-primary/30 text-primary px-8 py-6 font-bold uppercase tracking-widest transition-all rounded-md"
                            >
                                <FileText size={18} className="text-accent" /> View Classroom Locations with Church Map
                            </a>
                        </div>
                    </div>
                    <aside className="border-l-2 border-[#b8954f] pl-6 md:mb-1">
                        <p className="font-serif text-2xl italic leading-snug text-primary">Faith is a journey we walk together, supporting one another in love and truth.</p>
                        <p className="mt-3 text-xs font-bold uppercase tracking-[0.18em] text-[#9b762f]">Our Mission</p>
                    </aside>
                </div>
            </section>

            <main className="flex-grow py-12">
                <div className="container mx-auto px-4">
                    {/* Filter Section */}
                    <div className="mb-12">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                            <h2 className="font-serif text-3xl font-bold text-primary">Explore Our Programs</h2>
                            <button
                                onClick={deselectAll}
                                className="text-xs font-bold text-primary/40 hover:text-accent uppercase tracking-widest transition-colors self-end md:self-auto"
                            >
                                Deselect All
                            </button>
                        </div>

                        <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                            <button
                                onClick={() => toggleCategory('all')}
                                className={`px-6 py-3 rounded-full font-bold uppercase tracking-widest text-xs transition-all border-2 ${selectedCategories.has('all')
                                    ? 'bg-primary border-primary text-white shadow-lg'
                                    : 'bg-white border-primary/10 text-primary hover:border-primary/30'
                                    }`}
                            >
                                All Programs
                            </button>
                            {ageCategories.map(cat => (
                                <button
                                    key={cat.id}
                                    onClick={() => toggleCategory(cat.id)}
                                    className={`px-6 py-3 rounded-full font-bold uppercase tracking-widest text-xs transition-all border-2 ${selectedCategories.has(cat.id)
                                        ? 'bg-primary border-primary text-white shadow-lg'
                                        : 'bg-white border-primary/10 text-primary hover:border-primary/30'
                                        }`}
                                >
                                    {cat.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Events Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredEvents.map(event => (
                            <Card key={event.id} className="group flex flex-col border-2 border-primary/5 hover:border-primary/20 transition-all duration-300 overflow-hidden bg-white shadow-sm hover:shadow-xl">
                                <div className="p-8 pb-4 flex-grow">
                                    <div className="flex justify-between items-start mb-4">
                                        <span className="text-[8px] font-black uppercase tracking-widest px-2 py-0.5 bg-accent/10 text-accent rounded-full border border-accent/10">
                                            {ageCategories.find(c => c.id === event.ageCategory)?.label}
                                        </span>
                                    </div>

                                    <h3 className="font-serif text-2xl font-bold text-primary leading-tight mb-3 group-hover:text-accent transition-colors">
                                        {event.title}
                                    </h3>

                                    <p className="text-muted-foreground leading-relaxed text-sm mb-6">
                                        {event.description}
                                    </p>

                                    <div className="space-y-4 pt-4 border-t border-gray-100">
                                        <div className="flex items-center gap-3 text-sm">
                                            <div className="size-8 rounded-full bg-primary/5 flex items-center justify-center text-accent">
                                                <Calendar size={16} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-primary/40 uppercase tracking-widest">Time</p>
                                                <p className="font-bold text-primary">{event.dayTime}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 text-sm">
                                            <div className="size-8 rounded-full bg-primary/5 flex items-center justify-center text-accent">
                                                <MapPin size={16} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-primary/40 uppercase tracking-widest">Location</p>
                                                <p className="font-bold text-primary">{event.location}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-8 pt-4 bg-gray-50/50 border-t border-gray-100">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                                <User size={14} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-primary">{event.contactName}</p>
                                                <p className="text-[9px] text-muted-foreground">{event.contactPhone}</p>
                                            </div>
                                        </div>
                                        {event.contactPhone && (
                                            <a href={`tel:${event.contactPhone.replace(/\D/g, '')}`} className="p-2 text-primary/40 hover:text-accent transition-colors">
                                                <Phone size={16} />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>

                    {filteredEvents.length === 0 && (
                        <div className="text-center py-24 bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200">
                            <BookOpen className="size-12 text-gray-200 mx-auto mb-4" />
                            <h3 className="text-xl font-serif font-bold text-primary mb-2">No programs selected</h3>
                            <p className="text-muted-foreground">Select a category above to view our faith formation offerings.</p>
                            <Button variant="link" onClick={() => setSelectedCategories(new Set(['all']))} className="mt-4 text-accent font-bold">View All Programs</Button>
                        </div>
                    )}
                </div>
            </main>

            {/* Registration Modal */}
            {isFormOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-primary/40 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl my-8 overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="bg-primary p-6 text-white flex justify-between items-center">
                            <div>
                                <h3 className="font-serif text-2xl font-bold">Program Registration</h3>
                                <p className="text-xs text-white/70 uppercase tracking-widest mt-1">Faith Formation 2026-2027</p>
                            </div>
                            <button onClick={() => setIsFormOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        <form className="p-8 space-y-8 max-h-[80vh] overflow-y-auto custom-scrollbar" onSubmit={handleSubmit}>
                            <div className="bg-accent/5 p-6 rounded-2xl border border-accent/10 mb-8">
                                <h4 className="font-bold text-primary mb-2 flex items-center gap-2"><Heart size={18} className="text-accent" /> Registration Information</h4>
                                <p className="text-sm text-muted-foreground leading-relaxed">Please fill out the form below to register your children for our Faith Formation programs. All programs meet on Wednesdays from 6:00 PM to 7:30 PM.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-primary uppercase tracking-widest">Number of Children</label>
                                    <select
                                        name="numberOfChildren"
                                        value={formData.numberOfChildren}
                                        onChange={(e) => handleNumberOfChildrenChange(parseInt(e.target.value))}
                                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-primary outline-none"
                                    >
                                        {[1, 2, 3, 4, 5, 6].map(num => (
                                            <option key={num} value={num}>{num} {num === 1 ? 'Child' : 'Children'}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-primary uppercase tracking-widest">Are you a member at St. Therese?</label>
                                    <div className="flex gap-4 pt-2">
                                        {['Yes', 'No'].map(opt => (
                                            <label key={opt} className="flex items-center gap-2 cursor-pointer">
                                                <input type="radio" name="isMember" value={opt} checked={formData.isMember === opt} onChange={handleInputChange} className="accent-primary" />
                                                <span className="text-sm text-muted-foreground">{opt}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {formData.children.map((child, idx) => (
                                <div key={idx} className="p-6 border-2 border-gray-50 rounded-2xl space-y-4">
                                    <h4 className="font-bold text-primary uppercase tracking-widest text-sm">Child #{idx + 1}</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <input type="text" placeholder="Full Name" value={child.fullName} onChange={(e) => handleChildChange(idx, 'fullName', e.target.value)} className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-primary outline-none" required />
                                        <input type="text" placeholder="Preferred Name" value={child.preferredName} onChange={(e) => handleChildChange(idx, 'preferredName', e.target.value)} className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-primary outline-none" />
                                        <input type="text" placeholder="School" value={child.school} onChange={(e) => handleChildChange(idx, 'school', e.target.value)} className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-primary outline-none" />
                                        <input type="tel" placeholder="Phone (if applicable)" value={child.phone} onChange={(e) => handleChildChange(idx, 'phone', e.target.value)} className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-primary outline-none" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-primary uppercase tracking-widest">Sacraments Received:</label>
                                        <div className="flex flex-wrap gap-4">
                                            {Object.keys(child.sacraments).map(sac => (
                                                <label key={sac} className="flex items-center gap-2 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={(child.sacraments as any)[sac]}
                                                        onChange={(e) => handleChildChange(idx, 'sacraments', { ...child.sacraments, [sac]: e.target.checked })}
                                                        className="accent-primary"
                                                    />
                                                    <span className="text-xs text-muted-foreground capitalize">{sac.replace(/([A-Z])/g, ' $1')}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <div className="pt-8 border-t border-gray-100">
                                <h4 className="font-bold text-primary mb-4 uppercase tracking-widest text-sm">Parent/Guardian Information</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <input type="text" name="fatherFullName" placeholder="Father's Full Name" value={formData.fatherFullName} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-primary outline-none" />
                                        <input type="tel" name="fatherCell" placeholder="Father's Cell Phone" value={formData.fatherCell} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-primary outline-none" />
                                        <input type="email" name="fatherEmail" placeholder="Father's Email" value={formData.fatherEmail} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-primary outline-none" />
                                    </div>
                                    <div className="space-y-4">
                                        <input type="text" name="motherFullName" placeholder="Mother's Full Name" value={formData.motherFullName} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-primary outline-none" />
                                        <input type="tel" name="motherCell" placeholder="Mother's Cell Phone" value={formData.motherCell} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-primary outline-none" />
                                        <input type="email" name="motherEmail" placeholder="Mother's Email" value={formData.motherEmail} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-primary outline-none" />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-8 border-t border-gray-100">
                                <h4 className="font-bold text-primary mb-4 uppercase tracking-widest text-sm">Tuition & Payment</h4>
                                <div className="bg-primary/5 p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Tuition Fee ({formData.isMember === 'Yes' ? 'Member' : 'Non-Member'})</p>
                                        <p className="text-3xl font-serif font-bold text-primary">${tuitionCost}</p>
                                    </div>
                                    <div className="flex gap-4">
                                        {['per-child', 'family'].map(opt => (
                                            <label key={opt} className="flex items-center gap-2 cursor-pointer bg-white px-4 py-2 rounded-xl border border-primary/10">
                                                <input type="radio" name="tuitionOption" value={opt} checked={formData.tuitionOption === opt} onChange={handleInputChange} className="accent-primary" />
                                                <span className="text-sm text-primary font-bold capitalize">{opt.replace('-', ' ')}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <Button type="submit" disabled={isSubmitting} className="w-full bg-primary hover:bg-primary/90 py-6 text-sm font-bold uppercase tracking-widest">
                                {isSubmitting ? 'Processing...' : 'Complete Registration'}
                            </Button>
                        </form>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}