import { BrowserRouter, Route, Routes } from "react-router-dom";

import { MainLayout } from "../../widgets/Layouts/MainLayout/MainLayout";

import HomePage from "../../pages/HomePage";
import LoginPage from "../../pages/LoginPage/LoginPage";
import CallbackPage from "../../pages/CallbackPage";

import SearchPage from "../../pages/SearchPage";
import AlbumsPage from "../../pages/AlbumsPage";
import AlbumPage from "../../pages/AlbumPage/AlbumPage";
import LibraryPage from "../../pages/LibraryPage/LibraryPage";
import PlayListsPage from "../../pages/PlayListsPage/PlayListsPage";
import PlayListPage from "../../pages/PlayListPage/PlayListPage";
import NotFoundPage from "../../pages/NotFoundPage/NotFoundPage";
import { ProtectedRoute } from "./ProtectedRoute";

export const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/callback" element={<CallbackPage />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/albums" element={<AlbumsPage />} />
            <Route path="/albums/:albumId" element={<AlbumPage />} />
            <Route path="/library" element={<LibraryPage />} />
            <Route path="/playlists" element={<PlayListsPage />} />
            <Route path="/playlists/:playlistId" element={<PlayListPage />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};
