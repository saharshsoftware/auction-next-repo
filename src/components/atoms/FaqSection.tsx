'use client'
import React, { useState } from 'react';
import { Plus, X, HelpCircle, Minus } from 'lucide-react';
import Link from 'next/link';
import { ROUTE_CONSTANTS } from '@/shared/Routes';
import { renderMarkdown } from '@/shared/Utilies';
import Image from 'next/image';

export interface IFAQItem {
	question: string;
	answer: string;
	tags: string;
}

interface IFaqSectionProps {
	faqData: IFAQItem[];
	maxItems?: number;
	showImage?: boolean;
	imageUrl?: string;
	imageAlt?: string;
}

const FaqSection: React.FC<IFaqSectionProps> = ({
	faqData,
	maxItems = 5,
	showImage = true,
	imageUrl = '/images/faq-illustration.jpg',
	imageAlt = 'FAQ Help Illustration'
}) => {
	const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());

	const displayedFaqs = faqData.slice(0, maxItems);

	const toggleItem = (index: number) => {
		const newExpanded = new Set(expandedItems);
		if (newExpanded.has(index)) {
			newExpanded.delete(index);
		} else {
			newExpanded.add(index);
		}
		setExpandedItems(newExpanded);
	};

	return (
		<section className="py-16 bg-[#f9f9fb]">
			<div className="common-section">
				<div className="flex flex-col lg:flex-row gap-12 items-start">
					{/* FAQ Content - 60% on desktop */}
					<div className="w-full lg:w-3/5">
						{/* Header */}
						<div className="mb-8">
							<div className="flex items-center mb-4">
								<HelpCircle className="h-8 w-8 text-blue-600 mr-3" />
								<h2 className="text-3xl font-bold text-gray-900">
									Frequently Asked Questions
								</h2>
							</div>
							<p className="text-gray-600 text-sm-xs">
								Get quick answers to common questions about property auctions and bidding process.
							</p>
						</div>

						{/* FAQ Items */}
						<div className="space-y-4 mb-8">
							{displayedFaqs.map((faq, index) => (
								<div
									key={index}
									className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden transition-all duration-200 hover:shadow-md"
								>
									<button
										onClick={() => toggleItem(index)}
										className="w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors duration-200"
									>
										<div className="flex items-center justify-between">
											<div className="flex-1 pr-4">
												<h3 className="text-sm-xs font-semibold text-gray-900 mb-2">
													{faq.question}
												</h3>
												{faq.tags && (
													<span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-sm-xs font-medium rounded-full">
														{faq.tags}
													</span>
												)}
											</div>
											<div className="flex-shrink-0">
												{expandedItems.has(index) ? (
													<Minus className="h-5 w-5 text-gray-400 hover:text-red-500 transition-colors duration-200" />
												) : (
													<Plus className="h-5 w-5 text-gray-400 hover:text-blue-500 transition-colors duration-200" />
												)}
											</div>
										</div>
									</button>

									{expandedItems.has(index) && (
										<div className="px-6 pb-4 border-t border-gray-100 animate-fadeIn">
											<div
												className="text-left text-base leading-[30px] font-normal relative self-stretch danger-blog-class"
												dangerouslySetInnerHTML={{
													__html: renderMarkdown(faq.answer ?? ""),
												}}
											/>
										</div>
									)}
								</div>
							))}
						</div>

						{/* View All Button */}
						{faqData.length > maxItems && (
							<div className="text-center">
								<Link
									href={ROUTE_CONSTANTS.FAQ}
									className="inline-flex items-center px-6 py-3 bg-action-btn text-white rounded-lg hover:bg-action-btn-hover transition-colors duration-200 font-medium"
								>
									View All FAQs
									<Plus className="ml-2 h-4 w-4" />
								</Link>
							</div>
						)}
					</div>

					{/* Image Section - 40% on desktop, hidden on mobile */}
					{showImage && (
						<div className="hidden lg:block lg:w-2/5">
							<div className="relative h-[500px] rounded-lg overflow-hidden ">
								<Image
									src={imageUrl}
									alt={imageAlt}
									fill
									className="object-cover"
									sizes="(max-width: 1024px) 0px, 40vw"
									priority={false}
									onError={(e) => {
										// Fallback when image fails to load
										const target = e.target as HTMLImageElement;
										target.style.display = 'none';
									}}
								/>

							</div>
						</div>
					)}
				</div>
			</div>
		</section>
	);
};

export default FaqSection;