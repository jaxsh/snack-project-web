import { useIntl } from '@umijs/max';
import { Flex, theme } from 'antd';
import React from 'react';

/**
 * 密码强度颜色常量
 */
const STRENGTH_COLORS = ['', '#faad14', '#a0d911', '#52c41a'];

/**
 * 根据密码内容计算密码强度等级
 *
 * @param val 密码文本
 * @returns 强度等级: 0-无密码, 1-弱, 2-中, 3-强
 */
export const getStrengthLevel = (val: string): number => {
  if (!val) return 0;
  if (val.length < 8) return 1;

  const hasUpperCase = /[A-Z]/.test(val);
  const hasLowerCase = /[a-z]/.test(val);
  const hasDigit = /\d/.test(val);
  const hasSpecial = /[@$!%*?&]/.test(val);

  if (hasUpperCase && hasLowerCase && hasDigit && hasSpecial) {
    return 3;
  }

  const hasLetter = /[a-zA-Z]/.test(val);
  if (hasDigit && hasLetter) {
    return 2;
  }

  return 1;
};

interface PasswordStrengthBarProps {
  /**
   * 密码文本值
   */
  password?: string;
}

/**
 * 密码强度实时检测和指示器彩条组件
 */
export const PasswordStrengthBar: React.FC<PasswordStrengthBarProps> = ({
  password = '',
}) => {
  const { token } = theme.useToken();
  const intl = useIntl();
  const level = getStrengthLevel(password);

  const strengthTexts = [
    '',
    intl.formatMessage({ id: 'pages.common.dict.passwordStrength.weak' }),
    intl.formatMessage({ id: 'pages.common.dict.passwordStrength.medium' }),
    intl.formatMessage({ id: 'pages.common.dict.passwordStrength.strong' }),
  ];

  if (!password) {
    return null;
  }

  return (
    <Flex
      align="center"
      gap={8}
      style={{
        marginBottom: '16px',
        marginTop: '-12px',
      }}
    >
      <span style={{ fontSize: '12px', color: token.colorTextSecondary }}>
        {intl.formatMessage({ id: 'pages.common.dict.passwordStrength.label' })}
      </span>
      <Flex gap={4}>
        {[1, 2, 3].map((idx) => (
          <div
            key={idx}
            style={{
              width: '24px',
              height: '6px',
              borderRadius: '3px',
              backgroundColor:
                level === 0 || idx > level
                  ? token.colorFillSecondary
                  : STRENGTH_COLORS[level],
              transition: 'background-color 0.3s ease',
            }}
          />
        ))}
      </Flex>
      <span
        style={{
          fontSize: '12px',
          color: STRENGTH_COLORS[level],
          fontWeight: 500,
        }}
      >
        {strengthTexts[level]}
      </span>
    </Flex>
  );
};
