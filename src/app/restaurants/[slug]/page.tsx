import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { Clock, Mail, MapPin, Navigation, Phone, Star, UtensilsCrossed } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GuestReviewForm } from "@/components/restaurants/guest-review-form";
import { siteConfig } from "@/config/site";
import { getRestaurantDetails } from "@/features/restaurants/data/restaurants";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const restaurant = await getRestaurantDetails(slug);

  if (!restaurant) return { title: `Restaurant not found | ${siteConfig.name}` };

  return {
    title: `${displayText(restaurant.name, "Restaurant")} | ${siteConfig.name}`,
    description: displayText(restaurant.description, "Local dining spot serving the Kathmandu community."),
  };
}

export default async function RestaurantPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const restaurant = await getRestaurantDetails(slug);
  if (!restaurant) notFound();

  const name = displayText(restaurant.name, "Restaurant");
  const category = displayText(restaurant.cuisine, "Restaurant");
  const description = displayText(restaurant.description, "Local dining spot serving the Kathmandu community.");
  const city = displayText(restaurant.city, "Kathmandu");
  const address = displayText(restaurant.address, city);
  const openingHours = displayText(restaurant.openingHours, "Hours available on request");
  const phoneNumber = displayText(restaurant.phoneNumber, "Contact details available on request");
  const email = displayOptionalText(restaurant.contactEmail);
  const rating = restaurant.rating > 0 ? restaurant.rating.toFixed(1) : null;
  const reviewLabel = restaurant.reviewCount === 1 ? "1 review" : `${restaurant.reviewCount} reviews`;
  const coverImage = restaurant.imageUrl;
  const galleryImages = [
    { id: `${restaurant.id}-cover`, url: restaurant.imageUrl, alt: name },
    ...restaurant.images.filter((image) => image.url !== restaurant.imageUrl),
  ];
  const mapSrc = restaurant.latitude && restaurant.longitude
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${restaurant.longitude - 0.01}%2C${restaurant.latitude - 0.01}%2C${restaurant.longitude + 0.01}%2C${restaurant.latitude + 0.01}&layer=mapnik&marker=${restaurant.latitude}%2C${restaurant.longitude}`
    : null;
  const directionsUrl = restaurant.latitude && restaurant.longitude
    ? `https://www.google.com/maps/dir/?api=1&destination=${restaurant.latitude},${restaurant.longitude}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
  const largerMapUrl = restaurant.latitude && restaurant.longitude
    ? `https://www.openstreetmap.org/?mlat=${restaurant.latitude}&mlon=${restaurant.longitude}#map=16/${restaurant.latitude}/${restaurant.longitude}`
    : directionsUrl;

  return (
    <main className="relative isolate overflow-hidden bg-background pb-16 pt-8 text-foreground sm:pb-20 sm:pt-10">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_10%,rgba(217,102,58,0.11),transparent_35%),radial-gradient(circle_at_80%_40%,rgba(243,237,228,0.9),transparent_40%)]" />

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <section className="relative min-h-[440px] overflow-hidden rounded-2xl border border-border shadow-[0_20px_50px_rgba(42,33,28,0.18)] sm:min-h-[480px]">
          <Image src={coverImage} alt={name} fill priority className="object-cover object-center" sizes="100vw" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(42,33,28,0.86)_0%,rgba(42,33,28,0.48)_42%,rgba(42,33,28,0.05)_75%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(42,33,28,0.72)_0%,transparent_55%)]" />
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-9 lg:p-12">
            <Badge className="border border-white/20 bg-[#2A211C]/70 px-3 py-1 text-sm font-medium text-white backdrop-blur-md hover:bg-[#2A211C]/70">{category}</Badge>
            <h1 className="mt-4 max-w-4xl text-[clamp(40px,5vw,64px)] font-bold leading-[0.98] tracking-[-0.04em] text-white">{name}</h1>
            <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-white/75 sm:text-base">
              <span className="inline-flex items-center gap-1.5 font-medium text-white">{rating ? <><Star className="h-4 w-4 fill-primary text-primary" />{rating}</> : "No reviews yet"}</span>
              <span className="hidden text-white/35 sm:inline">•</span><span>{reviewLabel}</span>
              <span className="hidden text-white/35 sm:inline">•</span><span className="inline-flex items-center gap-1.5"><MapPin className="h-4 w-4 text-primary-foreground/90" />{city}</span>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-3 sm:grid-cols-3">
          <InfoBlock icon={<Star className="h-5 w-5 fill-primary text-primary" />} title={rating ? `${rating} average` : "No reviews yet"} copy={reviewLabel} />
          <InfoBlock icon={<Clock className="h-5 w-5 text-primary" />} title="Opening hours" copy={openingHours} />
          <InfoBlock icon={<MapPin className="h-5 w-5 text-primary" />} title="Location" copy={`${city}, Nepal`} />
        </section>

        <div className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)] lg:gap-10">
          <div className="min-w-0 space-y-12">
            <section>
              <SectionHeading title="Gallery" copy="A look inside the restaurant." />
              <Gallery images={galleryImages} restaurantName={name} />
            </section>

            <Surface>
              <SectionHeading title="About" />
              <p className="max-w-3xl text-[15px] leading-7 text-muted-foreground">{description}</p>
            </Surface>

            <Surface>
              <SectionHeading title="Menu" icon={<UtensilsCrossed className="h-5 w-5 text-primary" />} />
              <div className="space-y-8">
                {restaurant.menus.map((menu) => <section key={menu.id} className="space-y-4"><h3 className="text-lg font-semibold text-foreground">{displayText(menu.title, "Menu")}</h3>{menu.imageUrl ? <a href={menu.imageUrl} target="_blank" rel="noreferrer" className="group block"><div className="relative aspect-[3/4] max-w-md overflow-hidden rounded-xl border border-border bg-surface-alt"><Image src={menu.imageUrl} alt={`${displayText(menu.title, "Menu")} for ${name}`} fill className="object-contain transition duration-300 group-hover:scale-[1.02]" sizes="(max-width: 768px) 100vw, 448px" /></div></a> : null}{menu.categories.map((categoryItem) => <div key={categoryItem.id}><h4 className="mb-3 font-semibold text-foreground">{displayText(categoryItem.name, "Menu items")}</h4><div className="grid gap-3">{categoryItem.items.map((item) => <MenuItem key={item.id} name={item.name} description={item.description} price={Number(item.price)} />)}</div></div>)}{menu.items.map((item) => <MenuItem key={item.id} name={item.name} description={item.description} price={Number(item.price)} />)}</section>)}
                {restaurant.menus.every((menu) => !menu.imageUrl && menu.categories.length === 0 && menu.items.length === 0) ? <p className="text-sm text-muted-foreground">Menu items have not been added yet.</p> : null}
              </div>
            </Surface>

            <section id="reviews"><SectionHeading title="Customer reviews" copy="Recent diner feedback and rating distribution." /><div className="grid gap-6 md:grid-cols-[0.7fr_1.3fr]"><Surface className="h-fit"><div className="space-y-3">{restaurant.ratingDistribution.map((bucket) => <div key={bucket.rating} className="flex items-center gap-3 text-sm"><span className="w-10 text-muted-foreground">{bucket.rating} star</span><div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-alt"><div className="h-full bg-primary" style={{ width: `${restaurant.reviewCount ? (bucket.count / restaurant.reviewCount) * 100 : 0}%` }} /></div><span className="w-6 text-right text-muted-foreground">{bucket.count}</span></div>)}</div></Surface><div className="space-y-4">{restaurant.reviews.slice(0, 5).map((review) => <article key={review.id} className="rounded-xl border border-border bg-surface p-5 shadow-[0_1px_2px_rgba(42,33,28,0.04),0_4px_12px_rgba(42,33,28,0.06)]"><div className="mb-3 flex items-center justify-between gap-3"><p className="font-medium text-foreground">{displayText(review.guestName ?? review.user?.name, "Anonymous diner")}</p><span className="inline-flex items-center gap-1 text-sm text-muted-foreground"><Star className="h-4 w-4 fill-primary text-primary" />{review.rating}</span></div><p className="text-sm leading-6 text-muted-foreground">{displayText(review.comment, "This diner has shared a rating for this restaurant.")}</p></article>)}{restaurant.reviews.length === 0 ? <p className="rounded-xl border border-dashed border-border p-5 text-sm text-muted-foreground">No reviews yet. Be the first to share your experience.</p> : null}<GuestReviewForm restaurantId={restaurant.id} /></div></div></section>
          </div>

          <aside className="space-y-5 lg:sticky lg:top-6 lg:self-start">
            <Surface><SectionHeading title="Contact" /><div className="space-y-3 text-sm text-muted-foreground"><p className="flex items-center gap-2"><Phone className="h-4 w-4 text-primary" />{phoneNumber}</p>{email ? <p className="flex items-center gap-2 break-all"><Mail className="h-4 w-4 shrink-0 text-primary" />{email}</p> : null}</div><div className="mt-6 grid gap-3"><Button asChild className="w-full"><a href={directionsUrl} target="_blank" rel="noreferrer"><Navigation className="h-4 w-4" />Get directions</a></Button>{phoneNumber !== "Contact details available on request" ? <Button asChild variant="outline" className="w-full"><a href={`tel:${restaurant.phoneNumber}`}><Phone className="h-4 w-4" />Call restaurant</a></Button> : null}</div></Surface>
            <Surface><SectionHeading title="Opening hours" /><p className="flex items-start gap-2 text-sm leading-6 text-muted-foreground"><Clock className="mt-0.5 h-4 w-4 shrink-0 text-primary" />{openingHours}</p></Surface>
            <Surface><SectionHeading title="Map" /><div className="relative overflow-hidden rounded-xl border border-border bg-surface-alt">{mapSrc ? <iframe title={`${name} map`} src={mapSrc} className="h-64 w-full" loading="lazy" /> : <div className="flex h-64 flex-col items-center justify-center gap-3 text-center text-sm text-muted-foreground"><MapPin className="h-7 w-7 text-primary" />Map coordinates are not available.</div>}<div className="pointer-events-none absolute inset-0 bg-primary/5" /></div><Button asChild variant="link" className="mt-3 h-auto px-0 text-primary hover:text-primary/80"><a href={largerMapUrl} target="_blank" rel="noreferrer">View larger map <Navigation className="h-4 w-4" /></a></Button></Surface>
            <Surface><SectionHeading title="Recommended" />{restaurant.recommended.length ? <div className="space-y-3">{restaurant.recommended.map((item) => <a key={item.slug} href={`/restaurants/${item.slug}`} className="group flex gap-3 rounded-xl p-1 transition hover:bg-accent"><div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg"><Image src={item.imageUrl} alt={displayText(item.name, "Restaurant")} fill className="object-cover transition duration-300 group-hover:scale-105" sizes="64px" /></div><div className="min-w-0"><p className="truncate font-medium text-foreground">{displayText(item.name, "Restaurant")}</p><p className="mt-1 text-xs text-muted-foreground">{displayText(item.cuisine, "Restaurant")} · {displayText(item.city, "Kathmandu")}</p><p className="mt-1 inline-flex items-center gap-1 text-xs text-primary"><Star className="h-3.5 w-3.5 fill-current" />{item.rating > 0 ? item.rating.toFixed(1) : "New"}</p></div></a>)}</div> : <p className="rounded-xl border border-dashed border-border px-4 py-5 text-sm text-muted-foreground">More places coming soon.</p>}</Surface>
          </aside>
        </div>
      </div>
    </main>
  );
}

function displayText(value: string | null | undefined, fallback: string) {
  const cleaned = value?.trim();
  if (!cleaned || /^(www|undefined|null|n\/a|none|-+)$/i.test(cleaned) || /[;]{2,}/.test(cleaned)) return fallback;
  return cleaned;
}

function displayOptionalText(value: string | null | undefined) {
  const cleaned = displayText(value, "");
  return cleaned || null;
}

function Surface({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`rounded-2xl border border-border bg-surface p-6 shadow-[0_1px_2px_rgba(42,33,28,0.04),0_4px_12px_rgba(42,33,28,0.06)] transition-colors hover:border-primary/25 sm:p-7 ${className}`}>{children}</section>;
}

function SectionHeading({ title, copy, icon }: { title: string; copy?: string; icon?: ReactNode }) {
  return <div className="mb-6"><h2 className="flex items-center gap-2 text-2xl font-semibold tracking-[-0.025em] text-foreground">{icon}{title}</h2>{copy ? <p className="mt-2 text-sm text-muted-foreground">{copy}</p> : null}</div>;
}

function InfoBlock({ icon, title, copy }: { icon: ReactNode; title: string; copy: string }) {
  return <div className="flex min-h-28 items-center gap-4 rounded-xl border border-border bg-surface p-5 shadow-[0_1px_2px_rgba(42,33,28,0.04),0_4px_12px_rgba(42,33,28,0.06)]"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">{icon}</div><div><p className="font-semibold text-foreground">{title}</p><p className="mt-1 text-sm text-muted-foreground">{copy}</p></div></div>;
}

function Gallery({ images, restaurantName }: { images: Array<{ id: string; url: string; alt: string | null }>; restaurantName: string }) {
  if (images.length === 1) return <GalleryImage image={images[0]} restaurantName={restaurantName} className="aspect-[16/9]" sizes="(max-width: 1280px) 100vw, 66vw" />;
  const [main, ...secondary] = images;
  return <div className="grid gap-3 md:grid-cols-[2fr_1fr]"><GalleryImage image={main} restaurantName={restaurantName} className="aspect-[4/3] md:row-span-2 md:aspect-auto" sizes="(max-width: 768px) 100vw, 44vw" /><div className="grid grid-cols-2 gap-3 md:grid-cols-1">{secondary.slice(0, 2).map((image) => <GalleryImage key={image.id} image={image} restaurantName={restaurantName} className="aspect-[4/3]" sizes="(max-width: 768px) 50vw, 22vw" />)}</div>{secondary.slice(2).map((image) => <GalleryImage key={image.id} image={image} restaurantName={restaurantName} className="aspect-[4/3] md:col-span-1" sizes="(max-width: 768px) 50vw, 22vw" />)}</div>;
}

function GalleryImage({ image, restaurantName, className, sizes }: { image: { url: string; alt: string | null }; restaurantName: string; className: string; sizes: string }) {
  return <div className={`group relative overflow-hidden rounded-xl border border-border bg-surface-alt ${className}`}><Image src={image.url} alt={displayText(image.alt, restaurantName)} fill className="object-cover transition duration-300 ease-out group-hover:scale-[1.02]" sizes={sizes} /></div>;
}

function MenuItem({ name, description, price }: { name: string; description: string | null; price: number }) {
  return <div className="flex justify-between gap-4 border-b border-border pb-3"><div><p className="font-medium text-foreground">{displayText(name, "Menu item")}</p>{displayOptionalText(description) ? <p className="mt-1 text-sm text-muted-foreground">{displayOptionalText(description)}</p> : null}</div><p className="shrink-0 font-semibold text-primary">${price.toFixed(2)}</p></div>;
}
