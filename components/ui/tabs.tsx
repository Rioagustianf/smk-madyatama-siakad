"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type TabsContextValue = {
  value: string;
  setValue: (v: string) => void;
};

const TabsContext = React.createContext<TabsContextValue | null>(null);

type LegacyTab = { title: string; value: string; content?: React.ReactNode };

interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  tabs?: LegacyTab[];
}

function Tabs({
  defaultValue,
  value,
  onValueChange,
  className,
  tabs,
  children,
  ...props
}: TabsProps) {
  const isControlled = value !== undefined;
  const initial = defaultValue || (tabs && tabs[0]?.value) || "";
  const [uncontrolledValue, setUncontrolledValue] =
    React.useState<string>(initial);
  const currentValue = isControlled ? (value as string) : uncontrolledValue;

  const setValue = React.useCallback(
    (v: string) => {
      if (!isControlled) setUncontrolledValue(v);
      onValueChange?.(v);
    },
    [isControlled, onValueChange]
  );

  const hasLegacy = Array.isArray(tabs) && tabs.length > 0;

  return (
    <TabsContext.Provider value={{ value: currentValue, setValue }}>
      <div className={cn("w-full", className)} {...props}>
        {hasLegacy ? (
          <>
            <TabsList>
              {tabs!.map((t) => (
                <TabsTrigger key={t.value} value={t.value}>
                  {t.title}
                </TabsTrigger>
              ))}
            </TabsList>
            {tabs!.map((t) => (
              <TabsContent key={t.value} value={t.value}>
                {t.content}
              </TabsContent>
            ))}
          </>
        ) : (
          children
        )}
      </div>
    </TabsContext.Provider>
  );
}

function TabsList({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex flex-row items-center justify-start gap-2 overflow-auto sm:overflow-visible no-visible-scrollbar max-w-full w-full",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

interface TabsTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
}

function TabsTrigger({
  value,
  className,
  children,
  ...props
}: TabsTriggerProps) {
  const ctx = React.useContext(TabsContext);
  if (!ctx) return null;
  const active = ctx.value === value;
  return (
    <button
      type="button"
      data-state={active ? "active" : "inactive"}
      className={cn(
        "relative px-4 py-2 rounded-full border bg-background",
        active && "bg-primary/10",
        className
      )}
      onClick={() => ctx.setValue(value)}
      {...props}
    >
      <span className="relative block">{children}</span>
    </button>
  );
}

interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

function TabsContent({
  value,
  className,
  children,
  ...props
}: TabsContentProps) {
  const ctx = React.useContext(TabsContext);
  if (!ctx) return null;
  if (ctx.value !== value) return null;
  return (
    <div className={cn("mt-6", className)} {...props}>
      {children}
    </div>
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
