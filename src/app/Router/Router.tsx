import { BrowserRouter, Route, Routes } from "react-router-dom";

import { MainLayout } from "../../widgets/Layouts/mainLayout";

import HomePage from "../../pages/HomePage";
import LoginPage from "../../pages/LoginPage/LoginPage";
import CallbackPage from "../../pages/CallbackPage";

import { ProtectedRoute } from "./protectedRoute";
import SearchPage from "../../pages/SearchPage";
import PlayListPage from "../../pages/PlayListPage/PlayListPage";
import ArtistPage from "../../pages/ArtistPage/ArtistPage";
import AlbumPage from "../../pages/AlbumPage/AlbumPage";
import PodcastPage from "../../pages/PodcastPage";
import NotFoundPage from "../../pages/NotFoundPage/NotFoundPage";

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
            <Route path={"/playlists/:id"} element={<PlayListPage />} />
            <Route path="/albums/:albumId" element={<AlbumPage />} />
            <Route path="/artists/:artistId" element={<ArtistPage />} />
            <Route path="/podcasts/:showId" element={<PodcastPage />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};
