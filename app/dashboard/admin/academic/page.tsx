"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GraduationCap, Users } from "lucide-react";
import { MajorsTab } from "./components/MajorsTab";
import { AlumniTab } from "./components/AlumniTab";

export default function AdminAcademicPage() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"majors" | "alumni">("majors");

  return (
    <div className="min-h-screen bg-muted/30 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Manajemen Akademik
            </h1>
            <p className="text-muted-foreground">
              Kelola program keahlian dan testimoni alumni
            </p>
          </div>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as any)}
          className="w-full"
        >
          <TabsList>
            <TabsTrigger value="majors">
              <GraduationCap className="w-4 h-4 mr-2" />
              Program Keahlian
            </TabsTrigger>
            <TabsTrigger value="alumni">
              <Users className="w-4 h-4 mr-2" />
              Data Alumni
            </TabsTrigger>
          </TabsList>

          <TabsContent value="majors">
            <MajorsTab searchQuery={search} />
          </TabsContent>

          <TabsContent value="alumni">
            <AlumniTab searchQuery={search} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
