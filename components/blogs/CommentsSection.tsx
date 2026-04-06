/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import {
  LuMessageCircle,
  LuSend,
  LuLogIn,
  LuFlag,
  LuChevronDown,
} from "react-icons/lu";
import { blogService, type BlogComment } from "@/services/Blog.service";
import { useAuth } from "@/providers/AuthProvider";

// ─── Single comment + nested replies ──────────────────────────────────────────

interface CommentItemProps {
  comment: BlogComment;
  // FIX: typed properly instead of passing the whole User object around
  currentUsername?: string;
  currentAvatar?: string;
  onReply: (parentId: string, text: string) => Promise<void>;
  onReport: (commentId: string) => void;
  depth?: number;
}

function CommentItem({
  comment,
  currentUsername,
  currentAvatar,
  onReply,
  onReport,
  depth = 0,
}: CommentItemProps) {
  const [replyOpen, setReplyOpen] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showReplies, setShowReplies] = useState(true);

  const isLoggedIn = Boolean(currentUsername);

  const handleReply = async () => {
    if (!replyText.trim()) return;
    setSubmitting(true);
    await onReply(comment.id, replyText);
    setReplyText("");
    setReplyOpen(false);
    setSubmitting(false);
  };

  return (
    <div className={`flex gap-3 ${depth > 0 ? "mt-3" : ""}`}>
      {/* Avatar */}
      <div className="flex-shrink-0">
        {comment.user_avatar ? (
          <Image
            src={comment.user_avatar}
            alt={comment.user_name}
            width={34}
            height={34}
            className="rounded-full"
          />
        ) : (
          <div className="w-[34px] h-[34px] rounded-full bg-cyan-900 shadow flex items-center justify-center">
            <span className="text-cyan-90  text-xs font-bold">
              {comment.user_name?.[0]?.toUpperCase() ?? "?"}
            </span>
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        {/* Bubble */}
        <div className="bg-white border rounded-2xl shadow rounded-tl-none px-4 py-3">
          <p className="text-xs font-semibold text-cyan-900 mb-1">
            {comment.user_name}
          </p>
          <p className="text-sm text-gray-700 leading-relaxed break-words">
            {comment.content}
          </p>
        </div>

        {/* Action row */}
        <div className="flex items-center gap-4 mt-1.5 ml-1">
          <span className="text-xs text-gray-400">
            {formatDistanceToNow(new Date(comment.created_at), {
              addSuffix: true,
            })}
          </span>

          {/* Reply — only for logged-in users, max 2 levels deep */}
          {isLoggedIn && depth < 2 && (
            <button
              onClick={() => setReplyOpen((v) => !v)}
              className="text-xs font-semibold text-cyan-700 hover:text-amber-600 transition-colors"
            >
              {replyOpen ? "Cancel" : "Reply"}
            </button>
          )}

          {/* Report */}
          {isLoggedIn && (
            <button
              onClick={() => onReport(comment.id)}
              className="text-xs text-gray-300 hover:text-red-400 transition-colors
                         flex items-center gap-0.5"
              title="Report comment"
            >
              <LuFlag size={11} /> Report
            </button>
          )}
        </div>

        {/* Reply input */}
        {replyOpen && isLoggedIn && (
          <div className="mt-2 flex gap-2">
            {/* Mini avatar for reply input */}
            {currentAvatar ? (
              <Image
                src={currentAvatar}
                alt="You"
                width={26}
                height={26}
                className="rounded-full flex-shrink-0 mt-1"
              />
            ) : (
              <div
                className="w-[26px] h-[26px] rounded-full bg-cyan-100 flex items-center
                              justify-center flex-shrink-0 mt-1"
              >
                <span className="text-cyan-900 text-xs font-bold">
                  {currentUsername?.[0]?.toUpperCase()}
                </span>
              </div>
            )}
            <div className="flex-1 flex gap-2">
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder={`Reply to ${comment.user_name}…`}
                rows={2}
                className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-600
                           resize-none placeholder-gray-400 focus:outline-none
                           focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 transition-all"
              />
              <button
                onClick={handleReply}
                disabled={submitting || !replyText.trim()}
                className="self-end bg-cyan-900 text-white text-xs font-bold px-3 py-2
                           rounded-lg hover:bg-cyan-800 disabled:opacity-50 transition-colors"
              >
                {submitting ? "…" : "Post"}
              </button>
            </div>
          </div>
        )}

        {/* Nested replies */}
        {comment.replies?.length > 0 && (
          <div className="mt-2">
            <button
              onClick={() => setShowReplies((v) => !v)}
              className="flex items-center gap-1 text-xs text-cyan-700 font-semibold mb-2
                         hover:text-amber-600 transition-colors"
            >
              <LuChevronDown
                size={13}
                className={`transition-transform ${showReplies ? "rotate-180" : ""}`}
              />
              {showReplies ? "Hide" : "Show"} {comment.replies.length}{" "}
              {comment.replies.length === 1 ? "reply" : "replies"}
            </button>
            {showReplies && (
              <div className="pl-4 border-l-2 border-gray-100 space-y-3">
                {comment.replies.map((r) => (
                  <CommentItem
                    key={r.id}
                    comment={r}
                    currentUsername={currentUsername}
                    currentAvatar={currentAvatar}
                    onReply={onReply}
                    onReport={onReport}
                    depth={depth + 1}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function CommentSkeleton() {
  return (
    <div className="flex gap-3 animate-pulse">
      <div className="w-[34px] h-[34px] rounded-full bg-gray-100 flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-16 bg-gray-100 rounded-2xl rounded-tl-none" />
        <div className="h-3 w-24 bg-gray-100 rounded ml-1" />
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

interface CommentsSectionProps {
  blogId: string;
}

export default function CommentsSection({ blogId }: CommentsSectionProps) {
  const { user, setPostAuthAction, openAuth } = useAuth();
  const [comments, setComments] = useState<BlogComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // ── Helpers ────────────────────────────────────────────────────────────────

  const countAll = (list: BlogComment[]): number =>
    list.reduce((acc, c) => acc + 1 + countAll(c.replies ?? []), 0);

  const addReplyToTree = (
    list: BlogComment[],
    parentId: string,
    reply: BlogComment,
  ): BlogComment[] =>
    list.map((c) => {
      if (c.id === parentId)
        return { ...c, replies: [...(c.replies ?? []), reply] };
      if (c.replies?.length)
        return { ...c, replies: addReplyToTree(c.replies, parentId, reply) };
      return c;
    });

  // ── Fetch comments ─────────────────────────────────────────────────────────

  useEffect(() => {
    setLoading(true);
    blogService.getComments(blogId).then((res) => {
      // FIX: res.data is the full backend response { comments: [...] }
      if (res.success) setComments(res.data?.comments ?? []);
      setLoading(false);
    });
  }, [blogId]);

  // ── Post top-level comment ─────────────────────────────────────────────────

  const handlePost = async () => {
    if (!text.trim()) return;
    setSubmitting(true);
    setError("");

    const res = await blogService.postComment(blogId, text.trim());

    if (res.success && res.data?.comment) {
      // Optimistic update — merge in the current user's display info
      setComments((prev) => [
        ...prev,
        {
          ...res.data!.comment,
          // FIX: use user_name (display) and username (handle) from AuthProvider
          user_name: user?.fullname ?? user?.username ?? "You",
          username: user?.username ?? "",
          user_avatar: user?.avatar,
          replies: [],
        },
      ]);
      setText("");
    } else {
      setError(res.error ?? "Failed to post. Please try again.");
    }

    setSubmitting(false);
  };

  // ── Post reply ─────────────────────────────────────────────────────────────

  const handleReply = useCallback(
    async (parentId: string, replyText: string) => {
      const res = await blogService.postComment(blogId, replyText, parentId);
      if (res.success && res.data?.comment) {
        const newReply: BlogComment = {
          ...res.data.comment,
          user_name: user?.fullname ?? user?.username ?? "You",
          username: user?.username ?? "",
          user_avatar: user?.avatar,
          replies: [],
        };
        setComments((prev) => addReplyToTree(prev, parentId, newReply));
      }
    },
    [blogId, user],
  );

  // ── Report ─────────────────────────────────────────────────────────────────

  const handleReport = useCallback(async (commentId: string) => {
    const res = await blogService.reportComment(commentId);
    if (res.success) alert("Comment reported. Our team will review it.");
    else alert(res.error ?? "Failed to report comment.");
  }, []);

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <section className="mb-16">
      <h2 className="text-xl font-bold text-cyan-900 mb-8 flex items-center gap-2">
        <LuMessageCircle size={20} className="text-amber-500" />
        Discussion
        {!loading && (
          <span className="text-gray-400 font-normal text-base ml-1">
            ({countAll(comments)})
          </span>
        )}
      </h2>

      {/* Input or login gate */}
      {user ? (
        <div className="flex gap-3 mb-10">
          {user.avatar ? (
            <Image
              src={user.avatar}
              alt={user.username ?? "You"}
              width={36}
              height={36}
              className="rounded-full flex-shrink-0"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-cyan-100 flex items-center justify-center flex-shrink-0">
              <span className="text-cyan-900 font-bold text-sm">
                {(user.fullname ?? user.username)?.[0]?.toUpperCase()}
              </span>
            </div>
          )}

          <div className="flex-1">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Share your thoughts, ask a doubt, or leave a tip for others…"
              rows={3}
              maxLength={2000}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800
                         resize-none placeholder-gray-400 focus:outline-none
                         focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 transition-all"
            />
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-gray-400">{text.length}/2000</span>
              <button
                onClick={handlePost}
                disabled={submitting || !text.trim()}
                className="flex items-center gap-2 bg-cyan-900 text-white text-sm font-semibold
                           px-4 py-2 rounded-lg hover:bg-cyan-800 disabled:opacity-50
                           disabled:cursor-not-allowed transition-colors"
              >
                <LuSend size={13} />
                {submitting ? "Posting…" : "Post comment"}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-cyan-900 border border-cyan-100 rounded-2xl p-6 mb-10 text-center">
          <p className="text-cyan-9100 font-semibold mb-1">
            Join the discussion
          </p>
          <p className="text-amber-200 text-sm mb-4">
            Sign in to leave a comment, ask a doubt, or share your experience.
          </p>
          <div
            className="inline-flex items-center gap-2 bg-amber-600 text-white text-sm
                       font-semibold px-5 py-2.5 rounded-xl hover:scale(105) transition-colors cursor-pointer" onClick={() => openAuth()}
          >
            <LuLogIn size={15} /> Sign in to comment
          </div>
        </div>
      )}

      {/* Comments list */}
      {loading ? (
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <CommentSkeleton key={i} />
          ))}
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <LuMessageCircle size={36} className="mx-auto mb-3 text-gray-200" />
          <p className="text-sm font-medium">No comments yet</p>
          <p className="text-xs mt-1">Be the first to start the discussion</p>
        </div>
      ) : (
        <div className="space-y-6">
          {comments.map((c) => (
            <CommentItem
              key={c.id}
              comment={c}
              currentUsername={user?.username}
              currentAvatar={user?.avatar}
              onReply={handleReply}
              onReport={handleReport}
            />
          ))}
        </div>
      )}
    </section>
  );
}
