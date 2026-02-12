"use client";

import Link from "next/link";
import { Note } from "@/types/note";
import css from "./NoteList.module.css";

interface Props {
  notes: Note[];
  totalPages: number;
}

export default function NoteList({ notes }: Props) {
  return (
    <div className={css.list}>
      {notes.map((note) => (
        <div key={note.id} className={css.card}>
          <h3>{note.title}</h3>
          <p>{note.content}</p>

          <Link href={`/notes/${note.id}`}>View details</Link>
        </div>
      ))}
    </div>
  );
}
