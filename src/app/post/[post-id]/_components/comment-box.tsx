export default function CommentBox({ postId }: { postId: string }) {
    return (
        <div className="flex flex-col md:items-end p-2">
            <div className="md:w-1/2">
                {/* Header */}
                <div className="flex flex-col">
                    <h4>Leave a comment</h4>
                    <p>Say something about this post.</p>
                </div>
                {/* Divider */}
                <hr className="mt-4 border-t" />
                {/* Comment form */}
                <form className="flex flex-col">
                    {/* Comment input */}
                    <div className="form-group">
                        <label className="form-group">
                            <span className="form-label">Comment</span>
                            <textarea
                                className="form-input"
                                id="comment"
                                name="comment"
                                placeholder="Enter comment"
                                rows={3}
                                required
                            />
                        </label>
                    </div>
                </form>
            </div>
        </div>
    );
}
