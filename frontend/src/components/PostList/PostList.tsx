type AnyPost = Record<string, unknown> & { id?: string; _id?: string; caption?: string };

export default function PostList({ items }: { items: AnyPost[] }) {
  if (!items?.length) return <div>No posts yet.</div>;
  return (
    <ul style={{ display: 'grid', gap: 8, listStyle: 'none', padding: 0 }}>
      {items.map((p) => (
        <li key={(p.id as string) || (p._id as string)} style={{ padding: 12, border: '1px solid #eee', borderRadius: 8 }}>
          <div style={{ fontWeight: 600 }}>{p.caption || 'Untitled post'}</div>
        </li>
      ))}
    </ul>
  );
}