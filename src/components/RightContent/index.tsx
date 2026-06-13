import {
  BgColorsOutlined,
  CheckOutlined,
  GlobalOutlined,
} from '@ant-design/icons';
import {
  getAllLocales,
  getLocale,
  setLocale,
  useIntl,
  useModel,
} from '@umijs/max';
import type { MenuProps } from 'antd';
import { Button } from 'antd';
import { createStyles } from 'antd-style';
import React, { useMemo } from 'react';
import { getSystemNavTheme } from '@/utils/theme';
import HeaderDropdown from '../HeaderDropdown';

export const localeLabelMap: Record<string, { emoji: string; label: string }> =
  {
    'zh-CN': { emoji: '🇨🇳', label: '简体中文' },
    'en-US': { emoji: '🇺🇸', label: 'English' },
    'ja-JP': { emoji: '🇯🇵', label: '日本語' },
  };

const useStyles = createStyles(({ token, css }) => ({
  action: css`
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    height: 36px !important;
    min-width: 36px;
    padding-inline: 8px !important;
    padding-block: 0 !important;
    border-radius: ${token.borderRadius}px !important;
  `,
}));

export const LangDropdown: React.FC = () => {
  const { styles } = useStyles();
  const allLocales = useMemo(() => getAllLocales(), []);
  const currentLocale = getLocale();
  const supportLocales = allLocales.filter((l) => l in localeLabelMap);
  const intl = useIntl();

  if (supportLocales.length <= 1) {
    return null;
  }

  const langItems: MenuProps['items'] = supportLocales.map((locale) => ({
    key: `lang-${locale}`,
    icon:
      locale === currentLocale ? (
        <CheckOutlined style={{ color: '#52c41a' }} />
      ) : (
        <span style={{ display: 'inline-block', width: 14 }} />
      ),
    label: `${localeLabelMap[locale]?.emoji ?? ''} ${localeLabelMap[locale]?.label ?? locale}`,
  }));

  const onLangClick: MenuProps['onClick'] = ({ key }) => {
    if (key.startsWith('lang-')) {
      setLocale(key.replace('lang-', ''), false);
    }
  };

  return (
    <HeaderDropdown
      placement="bottomRight"
      arrow
      menu={{
        selectedKeys: [`lang-${currentLocale}`],
        onClick: onLangClick,
        items: langItems,
        style: { minWidth: 180 },
      }}
    >
      <Button
        type="text"
        className={styles.action}
        aria-label={intl.formatMessage({
          id: 'pages.common.text.langSwitch',
        })}
      >
        <GlobalOutlined />
      </Button>
    </HeaderDropdown>
  );
};

export const ThemeDropdown: React.FC = () => {
  const { styles } = useStyles();
  const { initialState, setInitialState } = useModel('@@initialState');
  const intl = useIntl();

  if (!initialState) {
    return null;
  }

  const currentPref = initialState.themePreference || 'auto';

  const themeItems: MenuProps['items'] = [
    {
      key: 'auto',
      icon:
        currentPref === 'auto' ? (
          <CheckOutlined style={{ color: '#52c41a' }} />
        ) : (
          <span style={{ display: 'inline-block', width: 14 }} />
        ),
      label: intl.formatMessage({ id: 'pages.common.dict.theme.auto' }),
    },
    {
      key: 'light',
      icon:
        currentPref === 'light' ? (
          <CheckOutlined style={{ color: '#52c41a' }} />
        ) : (
          <span style={{ display: 'inline-block', width: 14 }} />
        ),
      label: intl.formatMessage({ id: 'pages.common.dict.theme.light' }),
    },
    {
      key: 'realDark',
      icon:
        currentPref === 'realDark' ? (
          <CheckOutlined style={{ color: '#52c41a' }} />
        ) : (
          <span style={{ display: 'inline-block', width: 14 }} />
        ),
      label: intl.formatMessage({ id: 'pages.common.dict.theme.dark' }),
    },
  ];

  const onThemeClick: MenuProps['onClick'] = ({ key }) => {
    const nextPref = key as 'auto' | 'light' | 'realDark';
    const nextNavTheme = nextPref === 'auto' ? getSystemNavTheme() : nextPref;

    const nextSettings = {
      ...initialState.settings,
      navTheme: nextNavTheme,
    };

    setInitialState((s) => ({
      ...s,
      themePreference: nextPref,
      settings: nextSettings,
    }));

    if (typeof window !== 'undefined') {
      localStorage.setItem('snack-theme-preference', nextPref);
    }
  };

  return (
    <HeaderDropdown
      placement="bottomRight"
      arrow
      menu={{
        selectedKeys: [currentPref],
        onClick: onThemeClick,
        items: themeItems,
        style: { minWidth: 120 },
      }}
    >
      <Button
        type="text"
        className={styles.action}
        aria-label={intl.formatMessage({
          id: 'pages.common.text.themeSwitch',
        })}
      >
        <BgColorsOutlined />
      </Button>
    </HeaderDropdown>
  );
};
