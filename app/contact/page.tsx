import { redirect } from "next/navigation";

export default function ContactPage() {
  // Public contact page retired; route all traffic to the active Walls/Devine listening room
  redirect("/walls-devine");
}