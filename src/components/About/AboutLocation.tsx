const AboutLocation = () => {
  return (
    <section className="py-16 md:py-20 lg:py-28">
      <div className="container">
        <div className="rounded-2xl border border-gray-200/80 bg-slate-50 p-6 shadow-xs dark:border-white/10 dark:bg-gray-dark sm:p-8">
          <h3 className="mb-4 text-xl font-bold text-black dark:text-white sm:text-2xl lg:text-xl xl:text-2xl">
            Lokasi Kami
          </h3>
          <div className="overflow-hidden rounded-xl">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d557.3956900339347!2d107.2899466!3d-6.2954059!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e699d9e22af165f%3A0x72c10f32dfab428!2sMasjid%20Al%20Istiqomah!5e1!3m2!1sen!2sid!4v1776663185643!5m2!1sen!2sid"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="rounded-xl"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutLocation;
