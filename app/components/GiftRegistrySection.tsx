import Link from "next/link";

export default function GiftRegistrySection() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="inline-block text-sm text-primary font-medium uppercase tracking-wider mb-2">
            Registry
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-semibold mb-4">
            Gift Registry
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Your presence at our wedding is the greatest gift of all. However,
            if you wish to honor us with a gift, we've created a registry of
            items that would help us build our home together.
          </p>
        </div>

        <div className="text-center mt-12">
          <Link href="/gifts">
            <span className="inline-block bg-primary/10 text-primary hover:bg-primary hover:text-white px-6 py-3 rounded-md transition-all duration-300">
              View All Gifts
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
