"use client";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faBell,
  faHeart,
  faBookmark,
  faArrowRight,
  faHandshake,
  faQuestionCircle,
  faEnvelope,
  faMessage,
} from "@fortawesome/free-solid-svg-icons";
import ActionButton from "./ActionButton";
import { ROUTE_CONSTANTS } from "@/shared/Routes";
import { useRouter } from "next/navigation";

export function AuctionSmarterSection(props: { isAuthenticated?: boolean }) {
  const { isAuthenticated = false } = props;
  const router = useRouter();
  return (
    <>
      {/* Features Section */}
      <section className="bg-gray-50">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">
            Make Your Auction Journey{" "}
            <span className="text-blue-600">Smarter</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Unlock powerful features to streamline your property search and
            never miss out on opportunities.
          </p>
        </div>

        <div className="space-y-12 common-section mx-auto mb-12">
          {/* Save Searches */}
          <div className="bg-white rounded-lg overflow-hidden shadow-sm">
            <div className="flex flex-col md:flex-row md:h-[500px]">
              <div className="md:w-1/2 relative h-[300px] md:h-full">
                <Image
                  src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80"
                  alt="Person analyzing property search results on multiple screens"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              </div>
              <div className="md:w-1/2 p-8 flex flex-col justify-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
                  <FontAwesomeIcon
                    icon={faSearch}
                    className="h-8 w-8 text-blue-600"
                  />
                </div>
                <h3 className="text-2xl font-semibold mb-4">
                  Save Your Search
                </h3>
                <p className="text-gray-600 mb-6">
                  Tired of applying filters again and again? Save your search
                  preferences once and access them instantly whenever you need.
                  Perfect for regular property hunters and investors looking to
                  track specific market segments.
                </p>
                <div className="space-y-3 text-gray-600">
                  <div className="flex items-center gap-3">
                    <FontAwesomeIcon
                      icon={faArrowRight}
                      className="h-4 w-4 text-blue-600"
                    />
                    <span>Example: &quot;Plots under ₹30L in Jaipur&quot;</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <FontAwesomeIcon
                      icon={faArrowRight}
                      className="h-4 w-4 text-blue-600"
                    />
                    <span>Instant access, less effort, more efficiency</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Set Alerts */}
          <div className="bg-white rounded-lg overflow-hidden shadow-sm">
            <div className="flex flex-col md:flex-row-reverse md:h-[500px]">
              <div className="md:w-1/2 relative h-[300px] md:h-full">
                <Image
                  src="https://images.unsplash.com/photo-1590859808308-3d2d9c515b1a?auto=format&fit=crop&q=80"
                  alt="Mobile notifications for property alerts"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="md:w-1/2 p-8 flex flex-col justify-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
                  <FontAwesomeIcon
                    icon={faBell}
                    className="h-8 w-8 text-blue-600"
                  />
                </div>
                <h3 className="text-2xl font-semibold mb-4">
                  Get Notified Instantly
                </h3>
                <p className="text-gray-600 mb-6">
                  Stay ahead of the competition with real-time property alerts.
                  Get instant notifications when properties matching your
                  criteria are listed for auction. Never miss out on potential
                  opportunities in your target locations.
                </p>
                <div className="space-y-3 text-gray-600">
                  <div className="flex items-center gap-3">
                    <FontAwesomeIcon
                      icon={faArrowRight}
                      className="h-4 w-4 text-blue-600"
                    />
                    <span>Real-time updates for new auction listings</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <FontAwesomeIcon
                      icon={faArrowRight}
                      className="h-4 w-4 text-blue-600"
                    />
                    <span>
                      Customized notifications based on your preferences
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Use Wishlist */}
          <div className="bg-white rounded-lg overflow-hidden shadow-sm">
            <div className="flex flex-col md:flex-row md:h-[500px]">
              <div className="md:w-1/2 relative h-[300px] md:h-full">
                <Image
                  src="https://images.unsplash.com/photo-1626178793926-22b28830aa30?auto=format&fit=crop&q=80"
                  alt="Person organizing property wishlist"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="md:w-1/2 p-8 flex flex-col justify-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
                  <FontAwesomeIcon
                    icon={faHeart}
                    className="h-8 w-8 text-blue-600"
                  />
                </div>
                <h3 className="text-2xl font-semibold mb-4">
                  Keep Track of Favorites
                </h3>
                <p className="text-gray-600 mb-6">
                  Create multiple wishlists to organize properties based on your
                  investment goals. Compare properties, track prices, and make
                  informed decisions. Perfect for managing different investment
                  strategies or property types.
                </p>
                <div className="space-y-3 text-gray-600">
                  <div className="flex items-center gap-3">
                    <FontAwesomeIcon
                      icon={faArrowRight}
                      className="h-4 w-4 text-blue-600"
                    />
                    <span>Easy comparison of shortlisted properties</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <FontAwesomeIcon
                      icon={faArrowRight}
                      className="h-4 w-4 text-blue-600"
                    />
                    <span>Organize properties by investment strategy</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {!isAuthenticated && (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <ActionButton
              text="Log in to start saving"
              onclick={() => router.push(ROUTE_CONSTANTS.LOGIN)}
            />
            <ActionButton
              text="Create Free Account"
              isOutline
              onclick={() => router.push(ROUTE_CONSTANTS.REGISTER)}
            />
          </div>
        )}
      </section>

      {/* Partner and Help Sections */}
      <section>
        <div className="grid md:grid-cols-2 gap-8 common-section mx-auto">
          {/* Partner With Us */}
          <div className="bg-white rounded-lg p-8 shadow-sm">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <FontAwesomeIcon
                  icon={faHandshake}
                  className="h-8 w-8 text-blue-600"
                />
              </div>
              <h3 className="text-2xl font-bold mb-2">Partner With Us</h3>
              <p className="text-gray-600 mb-2">
                Are you a broker or financial institution interested in
                collaborating?
              </p>
              <p className="text-gray-600">
                We&apos;re building India&apos;s most trusted community for bank
                auctions. Let&apos;s work together to simplify the auction
                journey for everyone.
              </p>
            </div>
            <div className="text-center">
              <ActionButton text="Become a Partner" />
            </div>
          </div>

          {/* Need Help */}
          <div className="bg-white rounded-lg p-8 shadow-sm">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <FontAwesomeIcon
                  icon={faQuestionCircle}
                  className="h-8 w-8 text-blue-600"
                />
              </div>
              <h3 className="text-2xl font-bold mb-2">
                Need Help or Have a Query?
              </h3>
              <p className="text-gray-600 mb-2">
                We&apos;re here to assist you.
              </p>
              <p className="text-gray-600">
                Whether you&apos;re a customer, broker, or just curious about
                bank auctions — feel free to reach out.
              </p>
            </div>
            <div className="flex justify-center gap-4">
              <ActionButton
                text="Contact Support"
                onclick={() => router.push(ROUTE_CONSTANTS.CONTACT)}
                iconLeft={
                  <FontAwesomeIcon icon={faEnvelope} className="h-4 w-4" />
                }
              />

              <ActionButton
                isOutline={true}
                text="Send a Message"
                iconLeft={
                  <FontAwesomeIcon icon={faMessage} className="h-4 w-4" />
                }
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
