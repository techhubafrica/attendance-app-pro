import React from "react";
import {
  FileText,
  ClipboardCheck,
  AlertCircle,
  Scale,
  Clock,
  Bell,
  ExternalLink,
  Shield,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Footer from "@/components/Footer";

const TermsOfService = () => {
  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero section with gradient background */}
      <div className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white">
        <div className="container px-4 mx-auto max-w-5xl py-20">
          <div className="flex items-center gap-4 mb-6">
            <FileText className="h-12 w-12" />
            <h1 className="text-5xl font-bold">Terms of Service</h1>
          </div>
          <p className="text-xl max-w-2xl opacity-90">
            These Terms govern your access to and use of our platform. They
            outline your rights, responsibilities, and important legal
            information.
          </p>
          <div className="mt-6 flex items-center gap-2">
            <Clock className="h-5 w-5" />
            <p>Last updated: {currentDate}</p>
          </div>
        </div>
      </div>

      {/* Quick navigation */}
      <div className="bg-white shadow-sm border-b">
        <div className="container px-4 mx-auto max-w-5xl">
          <Tabs defaultValue="acceptance" className="py-2">
            <TabsList className="grid grid-cols-5 w-full">
              <TabsTrigger value="acceptance">Acceptance</TabsTrigger>
              <TabsTrigger value="responsibilities">
                Responsibilities
              </TabsTrigger>
              <TabsTrigger value="intellectual">IP Rights</TabsTrigger>
              <TabsTrigger value="termination">Termination</TabsTrigger>
              <TabsTrigger value="liability">Liability</TabsTrigger>
            </TabsList>

            {/* Main content */}
            <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-8 mt-30">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Sidebar */}
                <div className="md:col-span-1">
                  <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-16">
                    <h3 className="text-lg font-semibold mb-4">On This Page</h3>
                    <ul className="space-y-3">
                      <li>
                        <a
                          href="#acceptance"
                          className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800"
                        >
                          <ClipboardCheck className="h-4 w-4" />
                          <span>Acceptance of Terms</span>
                        </a>
                      </li>
                      <li>
                        <a
                          href="#responsibilities"
                          className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800"
                        >
                          <Scale className="h-4 w-4" />
                          <span>User Responsibilities</span>
                        </a>
                      </li>
                      <li>
                        <a
                          href="#intellectual"
                          className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800"
                        >
                          <AlertCircle className="h-4 w-4" />
                          <span>Intellectual Property</span>
                        </a>
                      </li>
                      <li>
                        <a
                          href="#termination"
                          className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800"
                        >
                          <Clock className="h-4 w-4" />
                          <span>Termination</span>
                        </a>
                      </li>
                      <li>
                        <a
                          href="#liability"
                          className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800"
                        >
                          <FileText className="h-4 w-4" />
                          <span>Limitation of Liability</span>
                        </a>
                      </li>
                    </ul>

                    <Separator className="my-6" />

                    <div className="bg-indigo-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Bell className="h-5 w-5 text-indigo-600" />
                        <h4 className="font-medium">Questions?</h4>
                      </div>
                      <p className="text-sm text-slate-700">
                        If you have questions about these Terms or need
                        clarification, please contact us at:
                      </p>
                      <a
                        href="mailto:admin@techhubafrica.org"
                        className="text-sm text-indigo-600 hover:underline mt-2 flex items-center gap-1"
                      >
                        admin@techhubafrica.org <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                </div>

                {/* Main content */}
                <div className="md:col-span-2 space-y-8">
                  <div className="bg-white rounded-lg shadow-sm border p-6">
                    <p className="text-slate-700">
                      These Terms of Service ("Terms") govern your access to and
                      use of our platform, including any associated mobile
                      applications, websites, software, and services
                      (collectively, the "Service"). Please read these Terms
                      carefully before using the Service.
                    </p>
                  </div>
                  <TabsContent value="acceptance" className="mt-0">
                    <Card
                      id="acceptance"
                      className="shadow-sm hover:shadow transition-shadow"
                    >
                      <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b">
                        <div className="flex items-center gap-3">
                          <div className="bg-white p-2 rounded-full shadow-sm">
                            <ClipboardCheck className="h-6 w-6 text-indigo-600" />
                          </div>
                          <div>
                            <CardTitle className="text-xl">
                              Acceptance of Terms
                            </CardTitle>
                            <CardDescription>
                              Your agreement to these terms and conditions
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-6">
                        <div className="flex flex-col md:flex-row gap-6">
                          <div className="md:w-3/5">
                            <p className="text-slate-700">
                              By accessing or using our Service, you agree to be
                              bound by these Terms and our Privacy Policy. If
                              you do not agree to these Terms, you may not
                              access or use the Service. These Terms apply to
                              all visitors, users, and others who access or use
                              the Service.
                            </p>
                          </div>
                          <div className="md:w-2/5 bg-amber-50 p-4 rounded-lg border border-amber-100">
                            <div className="flex items-center gap-2 mb-2">
                              <AlertCircle className="h-5 w-5 text-amber-600" />
                              <h4 className="font-medium">Important</h4>
                            </div>
                            <p className="text-sm text-slate-700">
                              Your continued use of the Service constitutes your
                              acceptance of any changes to these Terms. It is
                              your responsibility to review these Terms
                              periodically.
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="responsibilities" className="mt-0">
                    <Card
                      id="responsibilities"
                      className="shadow-sm hover:shadow transition-shadow"
                    >
                      <CardHeader className="bg-gradient-to-r from-green-50 to-teal-50 border-b">
                        <div className="flex items-center gap-3">
                          <div className="bg-white p-2 rounded-full shadow-sm">
                            <Scale className="h-6 w-6 text-teal-600" />
                          </div>
                          <div>
                            <CardTitle className="text-xl">
                              User Responsibilities
                            </CardTitle>
                            <CardDescription>
                              What we expect from our users
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-6 space-y-4">
                        <p className="text-slate-700">
                          When using our Service, you agree to:
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 flex items-start gap-3">
                            <div className="bg-teal-100 p-1 rounded-full mt-1">
                              <Scale className="h-4 w-4 text-teal-700" />
                            </div>
                            <div>
                              <h4 className="font-medium mb-1">
                                Account Security
                              </h4>
                              <p className="text-sm text-slate-600">
                                Maintain the security of your account and
                                password
                              </p>
                            </div>
                          </div>
                          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 flex items-start gap-3">
                            <div className="bg-teal-100 p-1 rounded-full mt-1">
                              <Scale className="h-4 w-4 text-teal-700" />
                            </div>
                            <div>
                              <h4 className="font-medium mb-1">
                                Accurate Information
                              </h4>
                              <p className="text-sm text-slate-600">
                                Provide accurate, current, and complete
                                information
                              </p>
                            </div>
                          </div>
                          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 flex items-start gap-3">
                            <div className="bg-teal-100 p-1 rounded-full mt-1">
                              <Scale className="h-4 w-4 text-teal-700" />
                            </div>
                            <div>
                              <h4 className="font-medium mb-1">
                                Account Responsibility
                              </h4>
                              <p className="text-sm text-slate-600">
                                Accept responsibility for all activities under
                                your account
                              </p>
                            </div>
                          </div>
                          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 flex items-start gap-3">
                            <div className="bg-teal-100 p-1 rounded-full mt-1">
                              <Scale className="h-4 w-4 text-teal-700" />
                            </div>
                            <div>
                              <h4 className="font-medium mb-1">Legal Usage</h4>
                              <p className="text-sm text-slate-600">
                                Not use the Service for any illegal or
                                unauthorized purpose
                              </p>
                            </div>
                          </div>
                          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 flex items-start gap-3">
                            <div className="bg-teal-100 p-1 rounded-full mt-1">
                              <Scale className="h-4 w-4 text-teal-700" />
                            </div>
                            <div>
                              <h4 className="font-medium mb-1">
                                Legal Compliance
                              </h4>
                              <p className="text-sm text-slate-600">
                                Not violate any laws in your jurisdiction
                              </p>
                            </div>
                          </div>
                          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 flex items-start gap-3">
                            <div className="bg-teal-100 p-1 rounded-full mt-1">
                              <Scale className="h-4 w-4 text-teal-700" />
                            </div>
                            <div>
                              <h4 className="font-medium mb-1">
                                Respect Others
                              </h4>
                              <p className="text-sm text-slate-600">
                                Not infringe upon or violate the rights of
                                others
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="intellectual" className="mt-0">
                    <Card
                      id="intellectual"
                      className="shadow-sm hover:shadow transition-shadow"
                    >
                      <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b">
                        <div className="flex items-center gap-3">
                          <div className="bg-white p-2 rounded-full shadow-sm">
                            <AlertCircle className="h-6 w-6 text-blue-600" />
                          </div>
                          <div>
                            <CardTitle className="text-xl">
                              Intellectual Property Rights
                            </CardTitle>
                            <CardDescription>
                              Ownership and usage rights
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-6">
                        <div className="bg-blue-50 p-5 rounded-lg border border-blue-100">
                          <div className="flex flex-col md:flex-row gap-6">
                            <div className="md:w-7/12">
                              <h4 className="font-medium text-blue-800 mb-3">
                                Our Ownership
                              </h4>
                              <p className="text-slate-700">
                                The Service and its original content, features,
                                and functionality are and will remain the
                                exclusive property of our company and its
                                licensors. The Service is protected by
                                copyright, trademark, and other laws.
                              </p>
                            </div>
                            <div className="md:w-5/12">
                              <h4 className="font-medium text-blue-800 mb-3">
                                Trademark Usage
                              </h4>
                              <p className="text-slate-700">
                                Our trademarks and trade dress may not be used
                                in connection with any product or service
                                without prior written consent.
                              </p>
                            </div>
                          </div>
                          <Separator className="my-4" />
                          <div className="flex items-start gap-3 mt-2">
                            <Shield className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                            <p className="text-slate-700">
                              All rights not expressly granted to you under
                              these Terms are reserved by our company and its
                              licensors.
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  <TabsContent value="termination" className="mt-0">
                    <Card
                      id="termination"
                      className="shadow-sm hover:shadow transition-shadow"
                    >
                      <CardHeader className="bg-gradient-to-r from-rose-50 to-red-50 border-b">
                        <div className="flex items-center gap-3">
                          <div className="bg-white p-2 rounded-full shadow-sm">
                            <Clock className="h-6 w-6 text-rose-600" />
                          </div>
                          <div>
                            <CardTitle className="text-xl">
                              Termination
                            </CardTitle>
                            <CardDescription>
                              Account suspension and service termination
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-6 space-y-6">
                        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                          <div className="bg-rose-50 p-4 border-b border-slate-200">
                            <h4 className="font-medium text-rose-800 flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              <span>Our Right to Terminate</span>
                            </h4>
                          </div>
                          <div className="p-4">
                            <p className="text-slate-700">
                              We may terminate or suspend your account and bar
                              access to the Service immediately, without prior
                              notice or liability, under our sole discretion,
                              for any reason whatsoever, including but not
                              limited to a breach of the Terms.
                            </p>
                          </div>
                        </div>

                        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                          <div className="bg-blue-50 p-4 border-b border-slate-200">
                            <h4 className="font-medium text-blue-800 flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              <span>Your Right to Terminate</span>
                            </h4>
                          </div>
                          <div className="p-4">
                            <p className="text-slate-700">
                              If you wish to terminate your account, you may
                              simply discontinue using the Service or contact us
                              to request account deletion.
                            </p>
                          </div>
                        </div>

                        <div className="bg-amber-50 p-4 rounded-lg border border-amber-100 flex items-center gap-3">
                          <AlertCircle className="h-6 w-6 text-amber-600 flex-shrink-0" />
                          <p className="text-slate-700">
                            Upon termination, your right to use the Service will
                            immediately cease. Some provisions of the Terms may
                            survive termination.
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="liability" className="mt-0">
                    <Card
                      id="liability"
                      className="shadow-sm hover:shadow transition-shadow"
                    >
                      <CardHeader className="bg-gradient-to-r from-purple-50 to-violet-50 border-b">
                        <div className="flex items-center gap-3">
                          <div className="bg-white p-2 rounded-full shadow-sm">
                            <FileText className="h-6 w-6 text-purple-600" />
                          </div>
                          <div>
                            <CardTitle className="text-xl">
                              Limitation of Liability
                            </CardTitle>
                            <CardDescription>
                              Our legal liability and your understanding
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-6 space-y-4">
                        <p className="text-slate-700">
                          In no event shall our company, its directors,
                          employees, partners, agents, suppliers, or affiliates
                          be liable for any indirect, incidental, special,
                          consequential, or punitive damages, including without
                          limitation, loss of profits, data, use, goodwill, or
                          other intangible losses, resulting from:
                        </p>

                        <div className="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-100">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <h4 className="font-medium flex items-center gap-2 mb-2">
                                <div className="bg-purple-100 p-1 rounded-full">
                                  <FileText className="h-4 w-4 text-purple-700" />
                                </div>
                                <span>Service Access</span>
                              </h4>
                              <p className="text-sm text-slate-600">
                                Your access to or use of or inability to access
                                or use the Service
                              </p>
                            </div>
                            <div>
                              <h4 className="font-medium flex items-center gap-2 mb-2">
                                <div className="bg-purple-100 p-1 rounded-full">
                                  <FileText className="h-4 w-4 text-purple-700" />
                                </div>
                                <span>Third Party Content</span>
                              </h4>
                              <p className="text-sm text-slate-600">
                                Any conduct or content of any third party on the
                                Service
                              </p>
                            </div>
                            <div>
                              <h4 className="font-medium flex items-center gap-2 mb-2">
                                <div className="bg-purple-100 p-1 rounded-full">
                                  <FileText className="h-4 w-4 text-purple-700" />
                                </div>
                                <span>Content Obtained</span>
                              </h4>
                              <p className="text-sm text-slate-600">
                                Any content obtained from the Service
                              </p>
                            </div>
                            <div>
                              <h4 className="font-medium flex items-center gap-2 mb-2">
                                <div className="bg-purple-100 p-1 rounded-full">
                                  <FileText className="h-4 w-4 text-purple-700" />
                                </div>
                                <span>Unauthorized Access</span>
                              </h4>
                              <p className="text-sm text-slate-600">
                                Unauthorized access, use, or alteration of your
                                transmissions or content
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-red-50 p-4 rounded-lg border border-red-100 flex items-center gap-3 mt-4">
                          <Shield className="h-6 w-6 text-red-600 flex-shrink-0" />
                          <p className="text-slate-700">
                            <span className="font-medium">Legal Notice:</span>{" "}
                            Some jurisdictions do not allow the exclusion of
                            certain warranties or the limitation of liability
                            for certain damages, so some of the above
                            limitations may not apply to you.
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </div>
              </div>
            </div>
          </Tabs>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default TermsOfService;
