export default function AdminDashboard() {
    return (
        <div>
            <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>System Status: <span style={{ color: 'var(--primary)' }}>ONLINE</span></h1>
            <p style={{ color: '#888', maxWidth: '600px' }}>
                Welcome to the secure backend interface. Use the command menu to manage entity data streams.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginTop: '3rem' }}>
                <div className="glass" style={{ padding: '2rem' }}>
                    <h3 style={{ color: '#888' }}>Active Projects</h3>
                    <p style={{ fontSize: '3rem', fontWeight: 'bold' }}>--</p>
                </div>
                <div className="glass" style={{ padding: '2rem' }}>
                    <h3 style={{ color: '#888' }}>Published Articles</h3>
                    <p style={{ fontSize: '3rem', fontWeight: 'bold' }}>--</p>
                </div>
            </div>
        </div>
    );
}
