import { type PageProps } from "$fresh/server.ts";
import Navbar from "../islands/Navbar.tsx";
import { State } from "./_middleware.ts";

export default function Layout(
  { Component, state }: PageProps<unknown, State>,
) {
  return (
    <>
      <Navbar user={state?.user} />
      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Component />
      </main>
    </>
  );
}
