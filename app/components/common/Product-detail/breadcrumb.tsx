"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface BreadcrumbProps {
    items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
    return (
        <div className="w-full ">
            <div className="container mx-auto px-6 py-5">
                <nav className="flex items-center text-sm text-ink-muted">
                    {items.map((item, index) => {
                        const isLast = index === items.length - 1;

                        return (
                            <div key={index} className="flex items-center ml-4">
                                {item.href && !isLast ? (
                                    <Link
                                        href={item.href}
                                        className="hover:text-gray-700 transition-colors"
                                    >
                                        {item.label}
                                    </Link>
                                ) : (
                                    <span
                                        className={`${isLast
                                            ? "text-ink font-medium"
                                            : "text-ink-muted"
                                            }`}
                                    >
                                        {item.label}
                                    </span>
                                )}

                                {!isLast && (
                                    <ChevronRight className="w-4 h-4 mx-1  text-gray-400" />
                                )}
                            </div>
                        );
                    })}
                </nav>
            </div>
        </div>
    );
}