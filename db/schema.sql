\restrict dbmate

-- Dumped from database version 16.13 (Debian 16.13-1.pgdg13+1)
-- Dumped by pg_dump version 18.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: click_events; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.click_events (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    session_id text NOT NULL,
    user_id text,
    event_name text NOT NULL,
    page text,
    element text,
    payload jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: error_events; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.error_events (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    message text NOT NULL,
    level text NOT NULL,
    service text,
    payload jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    session_id text,
    user_id text
);


--
-- Name: schema_migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.schema_migrations (
    version character varying NOT NULL
);


--
-- Name: click_events click_events_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.click_events
    ADD CONSTRAINT click_events_pkey PRIMARY KEY (id);


--
-- Name: error_events error_events_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.error_events
    ADD CONSTRAINT error_events_pkey PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: idx_click_events_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_click_events_created_at ON public.click_events USING btree (created_at DESC);


--
-- Name: idx_click_events_session_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_click_events_session_id ON public.click_events USING btree (session_id);


--
-- Name: idx_error_events_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_error_events_created_at ON public.error_events USING btree (created_at DESC);


--
-- Name: idx_error_events_level; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_error_events_level ON public.error_events USING btree (level);


--
-- Name: idx_error_events_payload; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_error_events_payload ON public.error_events USING gin (payload);


--
-- Name: idx_error_events_service; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_error_events_service ON public.error_events USING btree (service);


--
-- Name: idx_error_events_session_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_error_events_session_id ON public.error_events USING btree (session_id);


--
-- Name: idx_error_events_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_error_events_user_id ON public.error_events USING btree (user_id);


--
-- PostgreSQL database dump complete
--

\unrestrict dbmate


--
-- Dbmate schema migrations
--

INSERT INTO public.schema_migrations (version) VALUES
    ('20260330134649'),
    ('20260330171834');
