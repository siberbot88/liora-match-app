import React from 'react';
import {
    CheckCircleFilled,
    CloseCircleFilled,
    InfoCircleFilled,
    WarningFilled,
    CloseOutlined
} from '@ant-design/icons';
import { theme } from 'antd';

export type AlertType = 'success' | 'error' | 'warning' | 'info';

interface FancyAlertProps {
    type: AlertType;
    message: string;
    description?: string;
    showIcon?: boolean;
    closable?: boolean;
    onClose?: () => void;
    action?: React.ReactNode;
    style?: React.CSSProperties;
    className?: string;
}

export const FancyAlert: React.FC<FancyAlertProps> = ({
    type = 'info',
    message,
    description,
    showIcon = true,
    closable = false,
    onClose,
    action,
    style,
    className
}) => {
    const { token } = theme.useToken();

    // Configuration map for different alert types
    const config = {
        success: {
            icon: <CheckCircleFilled style={{ fontSize: 20, color: '#52c41a' }} />,
            bgColor: '#f6ffed',
            borderColor: '#b7eb8f',
            textColor: '#1f1f1f',
        },
        error: {
            icon: <CloseCircleFilled style={{ fontSize: 20, color: '#ff4d4f' }} />,
            bgColor: '#fff2f0',
            borderColor: '#ffccc7',
            textColor: '#1f1f1f',
        },
        warning: {
            icon: <WarningFilled style={{ fontSize: 20, color: '#faad14' }} />,
            bgColor: '#fffbe6',
            borderColor: '#ffe58f',
            textColor: '#1f1f1f',
        },
        info: {
            icon: <InfoCircleFilled style={{ fontSize: 20, color: token.colorPrimary }} />,
            bgColor: '#e6f7ff',
            borderColor: '#91d5ff',
            textColor: '#1f1f1f',
        }
    };

    const currentConfig = config[type];

    return (
        <div
            className={className}
            style={{
                display: 'flex',
                alignItems: description ? 'flex-start' : 'center',
                padding: '12px 16px',
                borderRadius: token.borderRadiusLG,
                backgroundColor: currentConfig.bgColor,
                border: `1px solid ${currentConfig.borderColor}`,
                marginBottom: 16,
                position: 'relative',
                transition: 'all 0.3s ease',
                ...style
            }}
        >
            {/* Icon Section */}
            {showIcon && (
                <div style={{ marginRight: 12, marginTop: description ? 2 : 0 }}>
                    {currentConfig.icon}
                </div>
            )}

            {/* Content Section */}
            <div style={{ flex: 1 }}>
                <div style={{
                    fontWeight: 600,
                    fontSize: 15,
                    color: currentConfig.textColor
                }}>
                    {message}
                </div>
                {description && (
                    <div style={{
                        marginTop: 4,
                        fontSize: 14,
                        color: 'rgba(0,0,0,0.65)'
                    }}>
                        {description}
                    </div>
                )}
            </div>

            {/* Action Section */}
            {action && (
                <div style={{ marginLeft: 16 }}>
                    {action}
                </div>
            )}

            {/* Close Button */}
            {closable && (
                <button
                    onClick={onClose}
                    style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 4,
                        marginLeft: 16,
                        color: 'rgba(0,0,0,0.45)',
                        transition: 'color 0.2s',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'rgba(0,0,0,0.75)'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(0,0,0,0.45)'}
                >
                    <CloseOutlined style={{ fontSize: 14 }} />
                </button>
            )}
        </div>
    );
};
