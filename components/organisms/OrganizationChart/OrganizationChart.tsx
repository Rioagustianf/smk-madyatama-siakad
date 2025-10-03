"use client";

import * as React from "react";
import { Tree, TreeNode } from "react-organizational-chart";

export type OrgPerson = {
  _id?: string;
  id?: string;
  name: string;
  position: string;
  image?: string;
  subject?: string;
  role?: string;
  createdAt?: string | Date;
};

export interface OrganizationChartProps {
  people: OrgPerson[];
  className?: string;
  // opsi UX tambahan
  lineColor?: string; // hex string yg diteruskan ke react-organizational-chart
  lineWidth?: string | number; // ketebalan garis
  nodePadding?: string | number; // padding antar node
  lineBorderRadius?: string | number; // radius lengkung garis
}

function LabelBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-block rounded-xl border-2 border-red-400 bg-white px-4 py-2 text-[14px] font-semibold text-slate-900 shadow-sm">
      {children}
    </div>
  );
}

function PersonBox({ person }: { person: OrgPerson }) {
  return (
    <LabelBox>
      <div className="whitespace-pre leading-tight">
        {person.name}
        {"\n"}
        <span className="font-normal text-slate-600">
          {person.subject || person.position}
        </span>
      </div>
    </LabelBox>
  );
}

export function OrganizationChart({
  people,
  className,
  lineColor,
  lineWidth,
  nodePadding,
  lineBorderRadius,
}: OrganizationChartProps) {
  const byStable = React.useCallback((a: OrgPerson, b: OrgPerson) => {
    const an = (a.name || "").localeCompare(b.name || "", "id-ID", {
      sensitivity: "base",
    });
    if (an !== 0) return an;
    return (a.position || "").localeCompare(b.position || "", "id-ID", {
      sensitivity: "base",
    });
  }, []);

  const head = people.find(
    (p) => (p.role || "").toLowerCase() === "headmaster"
  );

  // Kelompok berbasis role agar selalu muncul sesuai input admin
  const roleOf = (p: OrgPerson) => (p.role || "").toLowerCase();
  const vice = people.filter((p) => roleOf(p) === "vice-headmaster");
  // WKS tier (harus di bawah Wakil Kepala Sekolah). Hindari duplikasi: hanya role yang diawali 'wks'.
  const wks = people.filter((p) => {
    const r = roleOf(p);
    return r.startsWith("wks");
  });
  const kepalaProgram = people.filter((p) => roleOf(p) === "kepala-program");
  const kepalaTU = people.filter((p) => roleOf(p) === "kepala-tu");
  const teachers = people.filter((p) => roleOf(p) === "teacher");
  const admins = people.filter((p) =>
    ["staff", "other", "admin"].includes(roleOf(p))
  );

  const sortGroup = (arr: OrgPerson[]) => arr.slice().sort(byStable);

  const effectiveLineColor = lineColor ?? "green"; // contoh: hijau
  const effectiveLineWidth =
    typeof lineWidth === "number" ? `${lineWidth}px` : lineWidth ?? "2px";
  const effectiveNodePadding =
    typeof nodePadding === "number"
      ? `${nodePadding}px`
      : nodePadding ?? "12px";
  const effectiveLineBorderRadius =
    typeof lineBorderRadius === "number"
      ? `${lineBorderRadius}px`
      : lineBorderRadius ?? "10px";

  // Jika tidak ada kepala sekolah, jangan render struktur organisasi
  if (!head) return null;

  return (
    <div className={className}>
      <div className="overflow-auto rounded-lg border bg-white p-4">
        <Tree
          lineColor={effectiveLineColor}
          lineWidth={effectiveLineWidth}
          nodePadding={effectiveNodePadding}
          lineBorderRadius={effectiveLineBorderRadius}
          label={<PersonBox person={head} />}
        >
          {/* Wakil Kepala Sekolah (tier 2) */}
          {vice.length > 0 && (
            <TreeNode label={<LabelBox>Wakil Kepala Sekolah</LabelBox>}>
              {sortGroup(vice).map((p) => (
                <TreeNode
                  key={p._id || p.id || p.name}
                  label={<PersonBox person={p} />}
                />
              ))}
              {/* WKS (tier 3) berada di bawah Wakil Kepala Sekolah */}
              {wks.length > 0 && (
                <TreeNode label={<LabelBox>WKS (Bidang)</LabelBox>}>
                  {sortGroup(wks).map((p) => (
                    <TreeNode
                      key={p._id || p.id || p.name}
                      label={<PersonBox person={p} />}
                    />
                  ))}
                </TreeNode>
              )}
            </TreeNode>
          )}

          {/* Kepala Program Keahlian / Kompetensi */}
          {kepalaProgram.length > 0 && (
            <TreeNode
              label={<LabelBox>Kepala Program Keahlian / Kompetensi</LabelBox>}
            >
              {sortGroup(kepalaProgram).map((p) => (
                <TreeNode
                  key={p._id || p.id || p.name}
                  label={<PersonBox person={p} />}
                />
              ))}
            </TreeNode>
          )}

          {/* Kepala Tata Usaha */}
          {kepalaTU.length > 0 && (
            <TreeNode label={<LabelBox>Kepala Tata Usaha</LabelBox>}>
              {sortGroup(kepalaTU).map((p) => (
                <TreeNode
                  key={p._id || p.id || p.name}
                  label={<PersonBox person={p} />}
                />
              ))}
            </TreeNode>
          )}

          {/* Tenaga Pendidik */}
          {teachers.length > 0 && (
            <TreeNode label={<LabelBox>Tenaga Pendidik</LabelBox>}>
              {sortGroup(teachers).map((p) => (
                <TreeNode
                  key={p._id || p.id || p.name}
                  label={<PersonBox person={p} />}
                />
              ))}
            </TreeNode>
          )}

          {/* Staf Administrasi & Pendukung */}
          {admins.length > 0 && (
            <TreeNode label={<LabelBox>Staf / Bagian Pendukung</LabelBox>}>
              {sortGroup(admins).map((p) => (
                <TreeNode
                  key={p._id || p.id || p.name}
                  label={<PersonBox person={p} />}
                />
              ))}
            </TreeNode>
          )}
        </Tree>
      </div>
    </div>
  );
}
