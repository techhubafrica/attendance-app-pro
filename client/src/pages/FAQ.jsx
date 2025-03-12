import React, { useState } from 'react';
import { HelpCircle, MessageCircle, User, Book, School, Calendar, Search, ChevronRight, Clock, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Separator } from '@/components/ui/separator';
import Footer from '@/components/Footer';

const FAQ = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const faqs = [
    {
      category: "Account",
      icon: <User className="h-5 w-5 text-blue-600" />,
      gradient: "from-blue-50 to-indigo-50",
      questions: [
        {
          question: "How do I create an account?",
          answer: "To create an account, click on the 'Register' button in the top navigation bar. Fill out the required information including your name, email address, and password, then click 'Sign Up'."
        },
        {
          question: "How do I reset my password?",
          answer: "If you've forgotten your password, click on the 'Login' button, then select 'Forgot password?' on the login page. Enter your email address, and we'll send you instructions to reset your password."
        },
        {
          question: "Can I change my email address?",
          answer: "Yes, you can change your email address by going to your Profile page after logging in. Click on the 'Edit Profile' button and update your email address in the form provided."
        }
      ]
    },
    {
      category: "Books & Resources",
      icon: <Book className="h-5 w-5 text-emerald-600" />,
      gradient: "from-green-50 to-emerald-50",
      questions: [
        {
          question: "How do I borrow a book?",
          answer: "To borrow a book, browse the book catalog and select the book you'd like to borrow. Click on the 'Borrow' button on the book details page. You'll receive confirmation and the book will be added to your 'My Books' list."
        },
        {
          question: "What is the loan period for books?",
          answer: "The standard loan period for books is 14 days. You can extend the loan period for another 14 days if the book has not been reserved by another user."
        },
        {
          question: "How do I return a book?",
          answer: "To return a book, go to your 'My Books' page, find the book you want to return, and click on the 'Return' button. You'll receive a confirmation once the return has been processed."
        }
      ]
    },
    {
      category: "Academic",
      icon: <School className="h-5 w-5 text-purple-600" />,
      gradient: "from-purple-50 to-violet-50",
      questions: [
        {
          question: "How can I view my attendance records?",
          answer: "You can view your attendance records by logging into your account and clicking on the 'Attendance' button in your dashboard. This will show you a comprehensive view of your attendance across all courses."
        },
        {
          question: "How do I access course materials?",
          answer: "Course materials can be accessed through the respective course pages. After logging in, navigate to your courses and select the specific course to view all available materials."
        },
        {
          question: "Can I get academic assistance online?",
          answer: "Yes, you can schedule appointments with faculty members for academic assistance. Navigate to the 'Appointments' section in your dashboard to book a session."
        }
      ]
    },
    {
      category: "Appointments",
      icon: <Calendar className="h-5 w-5 text-amber-600" />,
      gradient: "from-amber-50 to-orange-50",
      questions: [
        {
          question: "How do I schedule an appointment?",
          answer: "To schedule an appointment, go to the 'Appointments' section in your dashboard. Click on 'Schedule New Appointment', select the faculty member, date, time, and purpose of the meeting, then submit your request."
        },
        {
          question: "Can I reschedule or cancel an appointment?",
          answer: "Yes, you can reschedule or cancel an appointment by going to the 'Appointments' section in your dashboard. Find the appointment you want to modify, then click on 'Reschedule' or 'Cancel' as needed."
        },
        {
          question: "How far in advance should I book an appointment?",
          answer: "We recommend booking appointments at least 48 hours in advance to ensure availability. However, some faculty members may accept shorter notice depending on their schedules."
        }
      ]
    }
  ];

  // Filter all questions based on search query
  const filteredFaqs = faqs.map(category => {
    return {
      ...category,
      questions: category.questions.filter(q => 
        q.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
        q.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    };
  }).filter(category => category.questions.length > 0);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero section with gradient background */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
        <div className="container px-4 mx-auto max-w-5xl py-20">
          <div className="flex items-center gap-4 mb-6">
            <HelpCircle className="h-12 w-12" />
            <h1 className="text-5xl font-bold">Frequently Asked Questions</h1>
          </div>
          <p className="text-xl max-w-2xl opacity-90">
            Find answers to the most common questions about our platform and services.
          </p>
          <div className="mt-6 flex items-center gap-2">
            <Clock className="h-5 w-5" />
            <p>Last updated: {new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</p>
          </div>
        </div>
      </div>
      
      {/* Quick navigation */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="container px-4 mx-auto max-w-5xl">
          <Tabs defaultValue="all" className="py-2">
            <TabsList className="grid grid-cols-5 w-full">
              <TabsTrigger value="all">All Questions</TabsTrigger>
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="books">Books & Resources</TabsTrigger>
              <TabsTrigger value="academic">Academic</TabsTrigger>
              <TabsTrigger value="appointments">Appointments</TabsTrigger>
            </TabsList>
            
            {/* Main content */}
            <div className="container px-4 mx-auto max-w-5xl py-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Sidebar */}
                <div className="md:col-span-1">
                  <div className="sticky top-16">
                    {/* Search bar */}
                    <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
                      <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Input
                          type="text"
                          placeholder="Search for questions..."
                          className="pl-10 pr-4"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow-sm border p-6">
                      <h3 className="text-lg font-semibold mb-4">FAQ Categories</h3>
                      <ul className="space-y-3">
                        {faqs.map((category, index) => (
                          <li key={index}>
                            <a href={`#${category.category.toLowerCase().replace(/\s+/g, '-')}`} className="flex items-center gap-2 text-blue-600 hover:text-blue-800">
                              <div className="bg-white p-1 shadow-sm border rounded-full">
                                {category.icon}
                              </div>
                              <span>{category.category}</span>
                            </a>
                          </li>
                        ))}
                      </ul>
                      
                      <Separator className="my-6" />
                      
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <MessageCircle className="h-5 w-5 text-blue-600" />
                          <h4 className="font-medium">Still have questions?</h4>
                        </div>
                        <p className="text-sm text-slate-700">
                          Our support team is here to help you with any other questions you might have.
                        </p>
                        <a href="mailto:admin@techhubafrica.org" className="text-sm text-blue-600 hover:underline mt-2 flex items-center gap-1">
                        admin@techhubafrica.org <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Main content */}
                <div className="md:col-span-2 space-y-10">
                  <TabsContent value="all" className="mt-0">
                    {searchQuery && filteredFaqs.length === 0 ? (
                      <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
                        <HelpCircle className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2">No results found</h3>
                        <p className="text-slate-600">
                          We couldn't find any matches for "{searchQuery}". Please try another search term.
                        </p>
                      </div>
                    ) : (
                      faqs.map((category, index) => {
                        const filteredCategory = filteredFaqs.find(c => c.category === category.category);
                        const questions = searchQuery ? filteredCategory?.questions : category.questions;
                        
                        if (searchQuery && !filteredCategory) return null;
                        
                        return (
                          <Card key={index} id={category.category.toLowerCase().replace(/\s+/g, '-')} className="shadow-sm hover:shadow transition-shadow">
                            <CardHeader className={`bg-gradient-to-r ${category.gradient} border-b`}>
                              <div className="flex items-center gap-3">
                                <div className="bg-white p-2 rounded-full shadow-sm">
                                  {category.icon}
                                </div>
                                <div>
                                  <CardTitle className="text-xl">{category.category}</CardTitle>
                                  <CardDescription>Common questions about {category.category.toLowerCase()}</CardDescription>
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent className="pt-6">
                              <Accordion type="single" collapsible className="w-full">
                                {questions?.map((faq, faqIdx) => (
                                  <AccordionItem key={faqIdx} value={`faq-${index}-${faqIdx}`} className="border-b last:border-0">
                                    <AccordionTrigger className="py-4 hover:no-underline">
                                      <div className="flex text-left">
                                        <span className="font-medium">{faq.question}</span>
                                      </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="py-4">
                                      <p className="text-slate-700">{faq.answer}</p>
                                    </AccordionContent>
                                  </AccordionItem>
                                ))}
                              </Accordion>
                            </CardContent>
                          </Card>
                        );
                      })
                    )}
                  </TabsContent>
                  
                  {/* Individual category tabs */}
                  {faqs.map((category, idx) => (
                    <TabsContent key={idx} value={category.category.toLowerCase()} className="mt-0">
                      <Card className="shadow-sm hover:shadow transition-shadow">
                        <CardHeader className={`bg-gradient-to-r ${category.gradient} border-b`}>
                          <div className="flex items-center gap-3">
                            <div className="bg-white p-2 rounded-full shadow-sm">
                              {category.icon}
                            </div>
                            <div>
                              <CardTitle className="text-xl">{category.category}</CardTitle>
                              <CardDescription>Common questions about {category.category.toLowerCase()}</CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-6">
                          {searchQuery && filteredFaqs.find(c => c.category === category.category)?.questions.length === 0 ? (
                            <div className="text-center py-8">
                              <HelpCircle className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                              <p className="text-slate-600">No questions found matching "{searchQuery}" in this category</p>
                            </div>
                          ) : (
                            <Accordion type="single" collapsible className="w-full">
                              {(searchQuery ? filteredFaqs.find(c => c.category === category.category)?.questions : category.questions)?.map((faq, faqIdx) => (
                                <AccordionItem key={faqIdx} value={`cat-${idx}-${faqIdx}`} className="border-b last:border-0">
                                  <AccordionTrigger className="py-4 hover:no-underline">
                                    <div className="flex text-left">
                                      <span className="font-medium">{faq.question}</span>
                                    </div>
                                  </AccordionTrigger>
                                  <AccordionContent className="py-4">
                                    <p className="text-slate-700">{faq.answer}</p>
                                  </AccordionContent>
                                </AccordionItem>
                              ))}
                            </Accordion>
                          )}
                        </CardContent>
                      </Card>
                    </TabsContent>
                  ))}
                  
                  {/* Contact section */}
                  <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-lg shadow-md p-8 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white mb-4">
                      <MessageCircle className="h-8 w-8 text-blue-600" />
                    </div>
                    <h2 className="text-2xl font-semibold mb-2">Still have questions?</h2>
                    <p className="text-white/90 mb-6 max-w-lg mx-auto">
                      Our support team is here to help you with any other questions you might have.
                      We typically respond within 24 hours.
                    </p>
                    <div className="flex justify-center">
                      <a href="mailto:admin@techhubafrica.org" className="bg-white text-blue-600 px-6 py-3 rounded-md hover:bg-blue-50 transition-colors inline-flex items-center gap-2 font-medium">
                        Contact Support <ChevronRight className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Tabs>
        </div>
       {/* Footer */}
       <Footer />
      </div>
    </div>
  );
};

export default FAQ;