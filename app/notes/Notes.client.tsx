"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchNotes, createNote } from "@/lib/api";
import NoteList from "@/components/NoteList/NoteList";
import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";
import Modal from "@/components/Modal/Modal";
import NoteForm from "@/components/NoteForm/NoteForm";
import css from "./NotesPage.module.css";

export default function NotesClient() {
  const router = useRouter();
  const params = useSearchParams();
  const queryClient = useQueryClient();

  const page = Number(params.get("page")) || 1;
  const search = params.get("search") || "";

  const [isOpen, setIsOpen] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ["notes", page, search],
    queryFn: () => fetchNotes(page, search),
  });

  const mutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      setIsOpen(false);
    },
  });

  const handleSearch = (value: string) => {
    router.push(`/notes?page=1&search=${value}`);
  };

  const handlePageChange = (newPage: number) => {
    router.push(`/notes?page=${newPage}&search=${search}`);
  };

  if (isLoading) return <p>Loading, please wait...</p>;
  if (error || !data) return <p>Something went wrong.</p>;

  return (
    <div className={css.container}>
      <div className={css.toolbar}>
        <SearchBox value={search} onChange={handleSearch} />
        <button onClick={() => setIsOpen(true)}>Create note</button>
      </div>

      <NoteList notes={data.notes} totalPages={data.totalPages} />

      <Pagination
        pageCount={data.totalPages}
        currentPage={page}
        onPageChange={handlePageChange}
      />

      {isOpen && (
        <Modal onClose={() => setIsOpen(false)}>
          <NoteForm onSubmit={(data) => mutation.mutate(data)} />
        </Modal>
      )}
    </div>
  );
}
