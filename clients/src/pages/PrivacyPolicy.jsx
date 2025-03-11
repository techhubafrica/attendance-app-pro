import React from "react";
import {
  Shield,
  Lock,
  Eye,
  UserCheck,
  FileText,
  Clock,
  Bell,
  ExternalLink,
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

const PrivacyPolicy = () => {
  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero section with gradient background */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
        <div className="container px-4 mx-auto max-w-5xl py-20">
          <div className="flex items-center gap-4 mb-6">
            <Shield className="h-12 w-12" />
            <h1 className="text-5xl font-bold">Privacy Policy</h1>
          </div>
          <p className="text-xl max-w-2xl opacity-90">
            We value your privacy and are committed to protecting your personal
            information. This policy explains how we collect, use, and safeguard
            your data.
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
          <Tabs defaultValue="collect" className="py-2">
            <TabsList className="grid md:grid-cols-5 w-full">
              <TabsTrigger value="collect">Information</TabsTrigger>
              <TabsTrigger value="use">Usage</TabsTrigger>
              <TabsTrigger value="share">Sharing</TabsTrigger>
              <TabsTrigger value="rights">Your Rights</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
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
                          href="#collect"
                          className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                        >
                          <Lock className="h-4 w-4" />
                          <span>Information We Collect</span>
                        </a>
                      </li>
                      <li>
                        <a
                          href="#use"
                          className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                        >
                          <UserCheck className="h-4 w-4" />
                          <span>How We Use Your Information</span>
                        </a>
                      </li>
                      <li>
                        <a
                          href="#share"
                          className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                        >
                          <Eye className="h-4 w-4" />
                          <span>Information Sharing</span>
                        </a>
                      </li>
                      <li>
                        <a
                          href="#rights"
                          className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                        >
                          <FileText className="h-4 w-4" />
                          <span>Your Rights</span>
                        </a>
                      </li>
                      <li>
                        <a
                          href="#security"
                          className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                        >
                          <Shield className="h-4 w-4" />
                          <span>Data Security</span>
                        </a>
                      </li>
                    </ul>

                    <Separator className="my-6" />

                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Bell className="h-5 w-5 text-blue-600" />
                        <h4 className="font-medium">Need Help?</h4>
                      </div>
                      <p className="text-sm text-slate-700">
                        If you have questions about this policy or how we handle
                        your data, please contact us at:
                      </p>
                      <a
                        href="mailto:admin@techhubafrica.org"
                        className="text-sm text-blue-600 hover:underline mt-2 flex items-center gap-1"
                      >
                        admin@techhubafrica.org <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                </div>

                {/* Main content */}
                <div className="md:col-span-2 space-y-8">
                  <TabsContent value="collect" className="mt-0">
                    <Card
                      id="collect"
                      className="shadow-sm hover:shadow transition-shadow"
                    >
                      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
                        <div className="flex items-center gap-3">
                          <div className="bg-white p-2 rounded-full shadow-sm">
                            <Lock className="h-6 w-6 text-blue-600" />
                          </div>
                          <div>
                            <CardTitle className="text-xl">
                              Information We Collect
                            </CardTitle>
                            <CardDescription>
                              How we gather and use your personal information
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-6 space-y-4">
                        <p className="text-slate-700">
                          We collect various types of information to provide and
                          improve our services to you:
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                            <h4 className="font-medium mb-2">
                              Personal Information
                            </h4>
                            <p className="text-sm text-slate-600">
                              Name, email address, phone number when you
                              register for an account
                            </p>
                          </div>
                          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                            <h4 className="font-medium mb-2">Usage Data</h4>
                            <p className="text-sm text-slate-600">
                              Information about how you interact with our
                              platform
                            </p>
                          </div>
                          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                            <h4 className="font-medium mb-2">
                              Device Information
                            </h4>
                            <p className="text-sm text-slate-600">
                              Browser type, IP address, and operating system
                            </p>
                          </div>
                          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                            <h4 className="font-medium mb-2">Cookies</h4>
                            <p className="text-sm text-slate-600">
                              Cookies and similar tracking technologies to
                              enhance your experience
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  <TabsContent value="use" className="mt-0">
                    <Card
                      id="use"
                      className="shadow-sm hover:shadow transition-shadow"
                    >
                      <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b">
                        <div className="flex items-center gap-3">
                          <div className="bg-white p-2 rounded-full shadow-sm">
                            <UserCheck className="h-6 w-6 text-emerald-600" />
                          </div>
                          <div>
                            <CardTitle className="text-xl">
                              How We Use Your Information
                            </CardTitle>
                            <CardDescription>
                              The purposes for which we process your data
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-6 space-y-4">
                        <p className="text-slate-700">
                          We use the information we collect for various
                          purposes:
                        </p>
                        <ul className="space-y-3 mt-4">
                          <li className="flex items-start gap-3">
                            <div className="bg-emerald-100 p-1 rounded-full mt-1">
                              <UserCheck className="h-4 w-4 text-emerald-700" />
                            </div>
                            <div>
                              <p className="font-medium">Providing Services</p>
                              <p className="text-sm text-slate-600">
                                Operating and maintaining our platform to
                                deliver the best experience
                              </p>
                            </div>
                          </li>
                          <li className="flex items-start gap-3">
                            <div className="bg-emerald-100 p-1 rounded-full mt-1">
                              <UserCheck className="h-4 w-4 text-emerald-700" />
                            </div>
                            <div>
                              <p className="font-medium">Personalization</p>
                              <p className="text-sm text-slate-600">
                                Improving and customizing your experience based
                                on preferences
                              </p>
                            </div>
                          </li>
                          <li className="flex items-start gap-3">
                            <div className="bg-emerald-100 p-1 rounded-full mt-1">
                              <UserCheck className="h-4 w-4 text-emerald-700" />
                            </div>
                            <div>
                              <p className="font-medium">Analytics</p>
                              <p className="text-sm text-slate-600">
                                Understanding how you use our platform to make
                                improvements
                              </p>
                            </div>
                          </li>
                          <li className="flex items-start gap-3">
                            <div className="bg-emerald-100 p-1 rounded-full mt-1">
                              <UserCheck className="h-4 w-4 text-emerald-700" />
                            </div>
                            <div>
                              <p className="font-medium">Communication</p>
                              <p className="text-sm text-slate-600">
                                Sending updates, security alerts, and support
                                messages
                              </p>
                            </div>
                          </li>
                          <li className="flex items-start gap-3">
                            <div className="bg-emerald-100 p-1 rounded-full mt-1">
                              <UserCheck className="h-4 w-4 text-emerald-700" />
                            </div>
                            <div>
                              <p className="font-medium">Security</p>
                              <p className="text-sm text-slate-600">
                                Preventing fraud and ensuring the safety of our
                                platform
                              </p>
                            </div>
                          </li>
                        </ul>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  <TabsContent value="share" className="mt-0">
                    <Card
                      id="share"
                      className="shadow-sm hover:shadow transition-shadow"
                    >
                      <CardHeader className="bg-gradient-to-r from-purple-50 to-violet-50 border-b">
                        <div className="flex items-center gap-3">
                          <div className="bg-white p-2 rounded-full shadow-sm">
                            <Eye className="h-6 w-6 text-purple-600" />
                          </div>
                          <div>
                            <CardTitle className="text-xl">
                              Information Sharing and Disclosure
                            </CardTitle>
                            <CardDescription>
                              When and how we share your information with others
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-6 space-y-4">
                        <p className="text-slate-700">
                          We may share your information in the following
                          situations:
                        </p>
                        <div className="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-100">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <h4 className="font-medium flex items-center gap-2 mb-2">
                                <div className="bg-purple-100 p-1 rounded-full">
                                  <Eye className="h-4 w-4 text-purple-700" />
                                </div>
                                <span>Service Providers</span>
                              </h4>
                              <p className="text-sm text-slate-600">
                                With vendors who help us operate our platform
                              </p>
                            </div>
                            <div>
                              <h4 className="font-medium flex items-center gap-2 mb-2">
                                <div className="bg-purple-100 p-1 rounded-full">
                                  <Eye className="h-4 w-4 text-purple-700" />
                                </div>
                                <span>Legal Compliance</span>
                              </h4>
                              <p className="text-sm text-slate-600">
                                To comply with applicable laws and regulations
                              </p>
                            </div>
                            <div>
                              <h4 className="font-medium flex items-center gap-2 mb-2">
                                <div className="bg-purple-100 p-1 rounded-full">
                                  <Eye className="h-4 w-4 text-purple-700" />
                                </div>
                                <span>Protection</span>
                              </h4>
                              <p className="text-sm text-slate-600">
                                To protect our rights, privacy, safety, or
                                property
                              </p>
                            </div>
                            <div>
                              <h4 className="font-medium flex items-center gap-2 mb-2">
                                <div className="bg-purple-100 p-1 rounded-full">
                                  <Eye className="h-4 w-4 text-purple-700" />
                                </div>
                                <span>Business Transfers</span>
                              </h4>
                              <p className="text-sm text-slate-600">
                                In connection with a merger, acquisition, or
                                sale of assets
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="mt-4 p-4 bg-red-50 rounded-lg border border-red-100 flex items-center gap-3">
                          <Shield className="h-6 w-6 text-red-600 flex-shrink-0" />
                          <p className="text-slate-700">
                            <span className="font-medium">Important:</span> We
                            do not sell your personal information to third
                            parties.
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  <TabsContent value="rights" className="mt-0">
                    <Card
                      id="rights"
                      className="shadow-sm hover:shadow transition-shadow"
                    >
                      <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 border-b">
                        <div className="flex items-center gap-3">
                          <div className="bg-white p-2 rounded-full shadow-sm">
                            <FileText className="h-6 w-6 text-amber-600" />
                          </div>
                          <div>
                            <CardTitle className="text-xl">
                              Your Rights
                            </CardTitle>
                            <CardDescription>
                              Control over your personal information
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-6 space-y-4">
                        <p className="text-slate-700">
                          Depending on your location, you may have the following
                          rights regarding your personal information:
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                          <div className="flex items-start gap-2">
                            <div className="bg-amber-100 p-1 rounded-full mt-1">
                              <FileText className="h-4 w-4 text-amber-700" />
                            </div>
                            <div>
                              <p className="font-medium">Access</p>
                              <p className="text-sm text-slate-600">
                                Receive a copy of your personal data
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <div className="bg-amber-100 p-1 rounded-full mt-1">
                              <FileText className="h-4 w-4 text-amber-700" />
                            </div>
                            <div>
                              <p className="font-medium">Rectification</p>
                              <p className="text-sm text-slate-600">
                                Correct inaccurate information
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <div className="bg-amber-100 p-1 rounded-full mt-1">
                              <FileText className="h-4 w-4 text-amber-700" />
                            </div>
                            <div>
                              <p className="font-medium">Deletion</p>
                              <p className="text-sm text-slate-600">
                                Request removal of your data
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <div className="bg-amber-100 p-1 rounded-full mt-1">
                              <FileText className="h-4 w-4 text-amber-700" />
                            </div>
                            <div>
                              <p className="font-medium">Restriction</p>
                              <p className="text-sm text-slate-600">
                                Limit how we use your data
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <div className="bg-amber-100 p-1 rounded-full mt-1">
                              <FileText className="h-4 w-4 text-amber-700" />
                            </div>
                            <div>
                              <p className="font-medium">Portability</p>
                              <p className="text-sm text-slate-600">
                                Receive data in a structured format
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <div className="bg-amber-100 p-1 rounded-full mt-1">
                              <FileText className="h-4 w-4 text-amber-700" />
                            </div>
                            <div>
                              <p className="font-medium">Withdraw Consent</p>
                              <p className="text-sm text-slate-600">
                                Revoke permission at any time
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="bg-blue-50 p-4 rounded-lg mt-6 flex items-start gap-3">
                          <Bell className="h-5 w-5 text-blue-600 flex-shrink-0 mt-1" />
                          <p className="text-slate-700">
                            To exercise these rights, please contact us at{" "}
                            <a
                              href="mailto:privacy@example.com"
                              className="text-blue-600 hover:underline"
                            >
                              privacy@example.com
                            </a>
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  <TabsContent value="security" className="mt-0">
                    <Card
                      id="security"
                      className="shadow-sm hover:shadow transition-shadow"
                    >
                      <CardHeader className="bg-gradient-to-r from-cyan-50 to-teal-50 border-b">
                        <div className="flex items-center gap-3">
                          <div className="bg-white p-2 rounded-full shadow-sm">
                            <Shield className="h-6 w-6 text-teal-600" />
                          </div>
                          <div>
                            <CardTitle className="text-xl">
                              Data Security
                            </CardTitle>
                            <CardDescription>
                              How we protect your information
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-6">
                        <div className="flex flex-col md:flex-row gap-6">
                          <div className="md:w-3/5">
                            <p className="text-slate-700">
                              We implement appropriate security measures to
                              protect your personal information from
                              unauthorized access, alteration, disclosure, or
                              destruction. Our security practices include:
                            </p>
                            <ul className="mt-4 space-y-2">
                              <li className="flex items-center gap-2">
                                <div className="bg-teal-100 p-1 rounded-full">
                                  <Shield className="h-3 w-3 text-teal-700" />
                                </div>
                                <span className="text-sm">
                                  Encryption of sensitive information
                                </span>
                              </li>
                              <li className="flex items-center gap-2">
                                <div className="bg-teal-100 p-1 rounded-full">
                                  <Shield className="h-3 w-3 text-teal-700" />
                                </div>
                                <span className="text-sm">
                                  Regular security assessments
                                </span>
                              </li>
                              <li className="flex items-center gap-2">
                                <div className="bg-teal-100 p-1 rounded-full">
                                  <Shield className="h-3 w-3 text-teal-700" />
                                </div>
                                <span className="text-sm">
                                  Secure data storage protocols
                                </span>
                              </li>
                              <li className="flex items-center gap-2">
                                <div className="bg-teal-100 p-1 rounded-full">
                                  <Shield className="h-3 w-3 text-teal-700" />
                                </div>
                                <span className="text-sm">
                                  Access controls and authentication
                                </span>
                              </li>
                            </ul>
                          </div>
                          <div className="md:w-2/5 bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                            <div className="flex items-center gap-2 mb-2">
                              <Bell className="h-5 w-5 text-yellow-600" />
                              <h4 className="font-medium">Important Notice</h4>
                            </div>
                            <p className="text-sm text-slate-700">
                              No method of transmission over the Internet or
                              electronic storage is 100% secure. While we strive
                              to use commercially acceptable means to protect
                              your information, we cannot guarantee absolute
                              security.
                            </p>
                          </div>
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

export default PrivacyPolicy;
