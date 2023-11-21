"use client";

export default function Home() {


  return (
    <>
      <header className="flex justify-between items-center p-6 bg-white">
        <div className="text-2xl font-bold text-gray-900">
          sage
        </div>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <a className="text-gray-900 hover:text-gray-700" href="#">
                Blog
              </a>
            </li>
            <li>
              <a className="text-gray-900 hover:text-gray-700" href="#">
                Manifesto
              </a>
            </li>
            <li>
              <a className="text-gray-900 hover:text-gray-700" href="#">
                About
              </a>
            </li>
          </ul>
        </nav>
        <button className="bg-black text-white px-4 py-2 rounded">
          Join the waitlist
        </button>
      </header>
      <main className="px-6 py-12">
        <section className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">
            Advancing Your Potential
            <br />
            With Applied Reading.
          </h1>
          <p className="text-xl mb-6">
            Let reading becomes a practical path to personal growth,
            <br />
            designed for you by AI.
          </p>
          <button className="bg-black text-white px-6 py-3 rounded">
            Join the waitlist
          </button>
        </section>
        <section className="grid grid-cols-3 gap-4">
          <div>
            <img alt="Placeholder image for the book Atomic Habits" className="w-full" height="300" src="https://oaidalleapiprodscus.blob.core.windows.net/private/org-cUI8WchvxcniyKodfHd7vIPx/user-MFNOO1kz7cPFPH8bSTXjz2q4/img-bWsAMAXpbpBjHQ0AYP9EFXYo.png?st=2023-11-21T03%3A04%3A58Z&amp;se=2023-11-21T05%3A04%3A58Z&amp;sp=r&amp;sv=2021-08-06&amp;sr=b&amp;rscd=inline&amp;rsct=image/png&amp;skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&amp;sktid=a48cca56-e6da-484e-a814-9c849652bcb3&amp;skt=2023-11-20T20%3A09%3A22Z&amp;ske=2023-11-21T20%3A09%3A22Z&amp;sks=b&amp;skv=2021-08-06&amp;sig=fDQD4bIvTnneOCU3TBhmF2wp2bKn%2BW5KQtab7%2BkjCVU%3D" width="200" />
          </div>
          <div>
            <img alt="Placeholder image for the book Psychology of Money" className="w-full" src="https://placehold.co/200x300" />
          </div>
          <div>
            <img alt="Placeholder image for the book Think and Grow Rich" className="w-full" height="300" src="https://oaidalleapiprodscus.blob.core.windows.net/private/org-cUI8WchvxcniyKodfHd7vIPx/user-MFNOO1kz7cPFPH8bSTXjz2q4/img-RWJTyKsxqinHnLF2QIcCNkzL.png?st=2023-11-21T03%3A04%3A56Z&amp;se=2023-11-21T05%3A04%3A56Z&amp;sp=r&amp;sv=2021-08-06&amp;sr=b&amp;rscd=inline&amp;rsct=image/png&amp;skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&amp;sktid=a48cca56-e6da-484e-a814-9c849652bcb3&amp;skt=2023-11-20T20%3A25%3A01Z&amp;ske=2023-11-21T20%3A25%3A01Z&amp;sks=b&amp;skv=2021-08-06&amp;sig=i9sV3h6plHYRYz9FLL91VfklnZ3YxfNZT9e79zoWUXc%3D" width="200" />
          </div>
          <div>
            <img alt="Placeholder image for the book Radical Candor" className="w-full" height="300" src="https://oaidalleapiprodscus.blob.core.windows.net/private/org-cUI8WchvxcniyKodfHd7vIPx/user-MFNOO1kz7cPFPH8bSTXjz2q4/img-nkFPLq3oh2kNpxHyjmfqmZNs.png?st=2023-11-21T03%3A04%3A57Z&amp;se=2023-11-21T05%3A04%3A57Z&amp;sp=r&amp;sv=2021-08-06&amp;sr=b&amp;rscd=inline&amp;rsct=image/png&amp;skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&amp;sktid=a48cca56-e6da-484e-a814-9c849652bcb3&amp;skt=2023-11-20T20%3A15%3A55Z&amp;ske=2023-11-21T20%3A15%3A55Z&amp;sks=b&amp;skv=2021-08-06&amp;sig=/AR09bWCwR2RnlDoaL6%2BM3YccIzDtGnxRapV/u7G3vU%3D" width="200" />
          </div>
          <div>
            <img alt="Placeholder image for the book Reinventing You" className="w-full" height="300" src="https://oaidalleapiprodscus.blob.core.windows.net/private/org-cUI8WchvxcniyKodfHd7vIPx/user-MFNOO1kz7cPFPH8bSTXjz2q4/img-BKRhu2gxRce9sqMXaqWoUN6d.png?st=2023-11-21T03%3A04%3A55Z&amp;se=2023-11-21T05%3A04%3A55Z&amp;sp=r&amp;sv=2021-08-06&amp;sr=b&amp;rscd=inline&amp;rsct=image/png&amp;skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&amp;sktid=a48cca56-e6da-484e-a814-9c849652bcb3&amp;skt=2023-11-20T20%3A39%3A02Z&amp;ske=2023-11-21T20%3A39%3A02Z&amp;sks=b&amp;skv=2021-08-06&amp;sig=kXmQrcSLsBUb%2B4T7rnZpOoamWI6Vq3%2BbllIBWZzHZEw%3D" width="200" />
          </div>
          <div>
            <img alt="Placeholder image for the book The Big Thing" className="w-full" height="300" src="https://oaidalleapiprodscus.blob.core.windows.net/private/org-cUI8WchvxcniyKodfHd7vIPx/user-MFNOO1kz7cPFPH8bSTXjz2q4/img-pHCIkmE5jG2bdeKiyPiOSFg5.png?st=2023-11-21T03%3A04%3A56Z&amp;se=2023-11-21T05%3A04%3A56Z&amp;sp=r&amp;sv=2021-08-06&amp;sr=b&amp;rscd=inline&amp;rsct=image/png&amp;skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&amp;sktid=a48cca56-e6da-484e-a814-9c849652bcb3&amp;skt=2023-11-20T20%3A24%3A10Z&amp;ske=2023-11-21T20%3A24%3A10Z&amp;sks=b&amp;skv=2021-08-06&amp;sig=J6Yl9y2RGzA6lsy4qTtrG4xJANvk8KMoLyZWjc5feyM%3D" width="200" />
          </div>
        </section>
      </main>
      <footer className="text-center p-4 text-gray-600 text-sm">
        © 2023 Paradigm Ltd.
      </footer>
    </>
  );
}
