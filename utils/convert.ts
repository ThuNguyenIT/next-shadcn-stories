export const convertToTimeAgo = (updatedAt: string) => {
    const updatedDate = new Date(updatedAt);
    const now = new Date();

    // Tính toán sự chênh lệch thời gian theo phút
    const diffMs = now.getTime() - updatedDate.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    if (diffMinutes < 1) return "Vừa xong";
    if (diffMinutes < 60) return `${diffMinutes} phút trước`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours} giờ trước`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} ngày trước`;
};


