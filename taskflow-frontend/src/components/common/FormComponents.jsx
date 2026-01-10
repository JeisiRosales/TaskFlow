import styles from '../../styles/components/modal.module.css';

export const Input = ({ label, ...props }) => (
    <div style={{ marginBottom: '16px' }}>
        {label && <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>{label}</label>}
        <input
            {...props}
            style={{
                width: '100%',
                padding: '10px 12px',
                backgroundColor: 'var(--color-background)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--color-text-primary)',
                fontSize: '14px'
            }}
        />
    </div>
);

export const Textarea = ({ label, ...props }) => (
    <div style={{ marginBottom: '16px' }}>
        {label && <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>{label}</label>}
        <textarea
            {...props}
            style={{
                width: '100%',
                padding: '10px 12px',
                backgroundColor: 'var(--color-background)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--color-text-primary)',
                fontSize: '14px',
                minHeight: '100px',
                resize: 'vertical'
            }}
        />
    </div>
);

export const Select = ({ label, options, ...props }) => (
    <div style={{ marginBottom: '16px' }}>
        {label && <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>{label}</label>}
        <select
            {...props}
            style={{
                width: '100%',
                padding: '10px 12px',
                backgroundColor: 'var(--color-background)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--color-text-primary)',
                fontSize: '14px'
            }}
        >
            {options.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
        </select>
    </div>
);

export const Button = ({ children, variant = 'primary', ...props }) => {
    const isPrimary = variant === 'primary';
    return (
        <button
            {...props}
            style={{
                padding: '10px 20px',
                backgroundColor: isPrimary ? 'var(--color-primary)' : 'transparent',
                color: isPrimary ? 'white' : 'var(--color-text-secondary)',
                border: isPrimary ? 'none' : '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                fontSize: '14px',
                fontWeight: '600',
                cursor: props.disabled ? 'not-allowed' : 'pointer',
                opacity: props.disabled ? 0.6 : 1,
                transition: 'var(--transition-fast)',
                ...props.style
            }}
        >
            {children}
        </button>
    );
};
