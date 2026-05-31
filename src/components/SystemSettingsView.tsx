import React, { useState } from 'react';
import { 
  User, 
  ShieldCheck, 
  Smartphone, 
  Trash2, 
  Database, 
  Bell, 
  Check, 
  X, 
  Plus, 
  Key, 
  CheckCircle2,
  Lock,
  ArrowRight,
  Copy,
  Globe,
  Sparkles
} from 'lucide-react';
import { TabId, UserProfile, DataSource, INITIAL_PROFILE, INITIAL_DATA_SOURCES } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface SystemSettingsViewProps {
  profile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
  dataSources: DataSource[];
  onAddDataSource: (ds: Omit<DataSource, 'id'>) => void;
  onRemoveDataSource: (id: string) => void;
}

export default function SystemSettingsView({ 
  profile, 
  onUpdateProfile, 
  dataSources,
  onAddDataSource,
  onRemoveDataSource
}: SystemSettingsViewProps) {
  // Temporary local states for editable forms
  const [name, setName] = useState(profile.name);
  const [deptAndTitle, setDeptAndTitle] = useState(profile.deptAndTitle);
  const [bio, setBio] = useState(profile.bio);
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl);
  
  // Controls
  const [showAvatarChooser, setShowAvatarChooser] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showConnectorModal, setShowConnectorModal] = useState(false);
  const [showBannerMessage, setShowBannerMessage] = useState<string | null>(null);

  // Password fields
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // Connector fields for dynamic database enrollment
  const [connType, setConnType] = useState<'postgresql' | 'mysql' | 'mongodb'>('postgresql');
  const [connName, setConnName] = useState('');
  const [connUrl, setConnUrl] = useState('');

  // Pre-configured premium avatars to switch easily
  const alternativeAvatars = [
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCxTTe7PQf8lEonbOO0rq63fgAB-bM_4o4WVHz4l1fkoMJ8GiMJqwRusqCZtAJujb8nuwVoTg9AQqu06D-uKHXcMe1zzTboEroGXabDZwsFOzL3fq52St3iSF5VI_VWLB3kQmm9xj7ziZlb1EzOgLaTnac_Z869ivOO-oPJBpTXNhb2NfBKXaBUjYhX2XcynVyPwMMfGUSONldWagymXbYNSaolGciFN8XaX27RsAtCbY47sNFUH8n74Id_vP7gMumcIsjpu9pd1Q',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80'
  ];

  // Google Login & Simulation states
  const [showGoogleSandboxModal, setShowGoogleSandboxModal] = useState(false);
  const [copiedRedirectUri, setCopiedRedirectUri] = useState(false);
  const [mockGoogleName, setMockGoogleName] = useState('唐若雪');
  const [mockGoogleEmail, setMockGoogleEmail] = useState('ruoxue.tang@gmail.com');
  const [mockGoogleAvatar, setMockGoogleAvatar] = useState('https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80');

  const defaultMockGoogleAccounts = [
    { name: '唐若雪', email: 'ruoxue.tang@gmail.com', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80', dept: 'Google 认证资深数据分析师' },
    { name: '唐若安', email: 'ruoan.tang@gmail.com', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80', dept: 'Google 交互体验研究员' },
    { name: '陈大贤', email: 'daxian.chen@gmail.com', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCxTTe7PQf8lEonbOO0rq63fgAB-bM_4o4WVHz4l1fkoMJ8GiMJqwRusqCZtAJujb8nuwVoTg9AQqu06D-uKHXcMe1zzTboEroGXabDZwsFOzL3fq52St3iSF5VI_VWLB3kQmm9xj7ziZlb1EzOgLaTnac_Z869ivOO-oPJBpTXNhb2NfBKXaBUjYhX2XcynVyPwMMfGUSONldWagymXbYNSaolGciFN8XaX27RsAtCbY47sNFUH8n74Id_vP7gMumcIsjpu9pd1Q', dept: 'Google 机器学习架构师' },
    { name: '李立飞', email: 'lifei.li@gmail.com', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80', dept: 'Google Web安全工程专家' }
  ];

  const handleGoogleLogin = async () => {
    try {
      const origin = window.location.origin;
      const response = await fetch(`/api/auth/google/url?origin=${encodeURIComponent(origin)}`);
      if (!response.ok) {
        throw new Error('无法联通 Google Auth 端点，启用高级沙盒模拟。');
      }
      const data = await response.json();
      if (data.mock) {
        setShowGoogleSandboxModal(true);
      } else {
        const authWindow = window.open(
          data.url,
          'google_oauth_popup',
          'width=540,height=650,resizable=yes,scrollbars=yes'
        );
        if (!authWindow) {
          alert('弹出窗口被浏览器拦截，请允许弹窗后再试。');
        }
      }
    } catch (e: any) {
      console.warn('Google Service down, trigger fallback sandbox', e);
      setShowGoogleSandboxModal(true);
    }
  };

  const handleCompleteSandboxLogin = (nameStr: string, emailStr: string, avatarStr: string, deptStr: string) => {
    // Dispatch standard message that our global listener picks up
    window.postMessage({
      type: 'OAUTH_AUTH_SUCCESS',
      profile: {
        ...profile,
        name: nameStr,
        email: emailStr,
        deptAndTitle: `${deptStr} · MarAI 联机专家`,
        bio: `${nameStr} 作为通过安全联机认证的特邀合作专家接入 MarAI，深度调配底层大底座模型推理。`,
        avatarUrl: avatarStr,
      }
    }, window.location.origin);

    // Sync form inputs of SystemSettingsView
    setName(nameStr);
    setDeptAndTitle(`${deptStr} · MarAI 联机专家`);
    setBio(`${nameStr} 作为通过安全联机认证的特邀合作专家接入 MarAI，深度调配底层大底座模型推理。`);
    setAvatarUrl(avatarStr);

    setShowGoogleSandboxModal(false);
    triggerFeedbackBanner(`成功模拟 Google 登录接入并重塑了主脑画像：${emailStr}`);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedRedirectUri(true);
    setTimeout(() => setCopiedRedirectUri(false), 2000);
  };

  // Save profile trigger
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      ...profile,
      name,
      deptAndTitle,
      bio,
      avatarUrl
    });
    triggerFeedbackBanner('个人简介及网络架构档案修改保存成功！');
  };

  const triggerFeedbackBanner = (msg: string) => {
    setShowBannerMessage(msg);
    setTimeout(() => {
      setShowBannerMessage(null);
    }, 3500);
  };

  // Toggle 2FA switch
  const handleToggle2FA = () => {
    onUpdateProfile({
      ...profile,
      twoFactorEnabled: !profile.twoFactorEnabled
    });
    triggerFeedbackBanner(profile.twoFactorEnabled ? '已成功解绑定双因素认证(2FA)限制。' : '双因素强效认证(2FA)保护已实装！');
  };

  // Sever connection with device
  const handleSeverDevice = () => {
    if (window.confirm('您确定要注销此绑定的 iPhone 14 Pro 认证密钥设备吗？Severing this device will restrict immediate automated token access.')) {
      onUpdateProfile({
        ...profile,
        boundDevice: null
      });
      triggerFeedbackBanner('已断开绑定认证设备的安全链接。');
    }
  };

  // Connect postgresql or mysql via bento
  const handleConnectorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!connName.trim() || !connUrl.trim()) return;

    onAddDataSource({
      name: connName,
      type: connType as any,
      status: 'connected',
      subtitle: `${connType.toUpperCase()} 集群配置成功 · 刚刚完成心跳同步`
    });

    setConnName('');
    setConnUrl('');
    setShowConnectorModal(false);
    triggerFeedbackBanner(`成功注册底层大底座 ${connName} 数据源流！`);
  };

  // Click on unconfigured card (usually Postgres card index-2)
  const handleUnconfiguredClick = (ds: DataSource) => {
    if (ds.status === 'not-configured') {
      setConnName(ds.name);
      setConnType('postgresql');
      setConnUrl('postgresql://marai-admin:******@marai-db-instance:5432/main');
      setShowConnectorModal(true);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-6xl mx-auto space-y-12"
    >
      {/* Banner Notifications feedback */}
      <AnimatePresence>
        {showBannerMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed top-20 right-8 z-50 bg-primary text-white text-xs font-semibold px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 border border-primary-container"
          >
            <CheckCircle2 className="w-4 h-4 text-white" />
            <span>{showBannerMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <section id="settings-header" className="space-y-4">
        <h2 className="font-headline text-4xl lg:text-5xl font-bold tracking-tight text-on-surface">系统全局配置</h2>
        <p className="font-body text-base text-on-surface-variant max-w-2xl leading-relaxed">
          精细化管理您的数字档案、安全凭证以及底层数据源集成。您的设置将实时同步至整个工作空间，确保分析环境的连贯性。
        </p>
      </section>

      {/* Bento Grid layout */}
      <div id="settings-grid" className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Column (Personal changes) Spans 2 cols */}
        <section className="lg:col-span-2 bg-surface rounded-[2rem] p-8 lg:p-10 border border-surface-container-highest/40 relative overflow-hidden group text-left">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
          
          <div className="flex items-center gap-3 mb-8 relative z-10">
            <User className="text-primary w-6 h-6 stroke-[2.2px]" />
            <h3 className="font-headline text-2xl font-medium text-on-surface">个人资料修改</h3>
          </div>

          <div className="flex flex-col md:flex-row gap-10 relative z-10 items-center md:items-start">
            
            {/* Avatar block selectors */}
            <div className="flex flex-col items-center gap-4 shrink-0">
              <div 
                onClick={() => setShowAvatarChooser(!showAvatarChooser)}
                className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-surface bg-surface-container shadow-sm relative group cursor-pointer border border-outline-variant/20"
              >
                <img 
                  src={avatarUrl} 
                  alt="Avatar" 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-white font-label text-xs font-bold">更换头像</span>
                </div>
              </div>
              
              <button 
                type="button"
                onClick={() => setShowAvatarChooser(!showAvatarChooser)}
                className="font-label text-xs font-semibold text-primary hover:text-primary-container transition-colors cursor-pointer"
              >
                更换选择头像
              </button>

              {/* Chosen dropdown popup list */}
              {showAvatarChooser && (
                <div className="bg-surface border border-outline-variant/15 p-2 rounded-xl grid grid-cols-4 gap-1.5 shadow-md">
                  {alternativeAvatars.map((url, i) => (
                    <div 
                      key={i} 
                      onClick={() => {
                        setAvatarUrl(url);
                        setShowAvatarChooser(false);
                      }}
                      className="w-8 h-8 rounded-full overflow-hidden border border-outline-variant/20 cursor-pointer hover:border-primary shrink-0"
                    >
                      <img src={url} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Form details block */}
            <form onSubmit={handleSaveProfile} className="flex-1 space-y-6 w-full font-label text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Name */}
                <div className="space-y-1.5">
                  <label className="font-semibold text-on-surface-variant uppercase tracking-wider block">全名</label>
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full bg-surface-container-lowest text-on-surface font-body p-3 rounded-xl border border-outline-variant/20 focus:border-primary outline-none transition-colors"
                  />
                </div>

                {/* Email (Readonly as in screenshot) */}
                <div className="space-y-1.5">
                  <label className="font-semibold text-on-surface-variant uppercase tracking-wider block opacity-70">工作邮箱 (不可更改)</label>
                  <input 
                    type="email" 
                    value={profile.email}
                    readOnly
                    className="w-full bg-surface-container-low text-on-surface-variant font-body p-3 rounded-xl border border-outline-variant/20 outline-none cursor-not-allowed opacity-80"
                  />
                </div>

              </div>

              {/* Department levels & tags */}
              <div className="space-y-1.5">
                <label className="font-semibold text-on-surface-variant uppercase tracking-wider block">所属部门与平台职级</label>
                <input 
                  type="text" 
                  value={deptAndTitle}
                  onChange={(e) => setDeptAndTitle(e.target.value)}
                  required
                  className="w-full bg-surface-container-lowest text-on-surface font-body p-3 rounded-xl border border-outline-variant/20 focus:border-primary outline-none transition-colors"
                />
              </div>

              {/* Biography brief */}
              <div className="space-y-1.5">
                <label className="font-semibold text-on-surface-variant uppercase tracking-wider block">个人简介</label>
                <textarea 
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  required
                  className="w-full bg-surface-container-lowest text-on-surface font-body p-3 rounded-xl border border-outline-variant/20 focus:border-primary outline-none resize-none transition-colors"
                />
              </div>

              {/* Save changes CTAs */}
              <div className="pt-2 flex justify-end">
                <button 
                  type="submit"
                  className="bg-primary text-white font-body font-medium px-8 py-3 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
                >
                  保存修改
                </button>
              </div>

            </form>

          </div>
        </section>

        {/* Right Column (Account Protection parameters) Spans 1 col */}
        <section className="lg:col-span-1 bg-surface-container-low rounded-[2rem] p-8 lg:p-10 flex flex-col relative overflow-hidden text-left border border-outline-variant/10">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <ShieldCheck className="text-primary w-6 h-6 stroke-[2.2px]" />
              <h3 className="font-headline text-2xl font-medium text-on-surface">账户安全</h3>
            </div>
            
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-tertiary-container/30 text-tertiary font-label text-[10px] font-bold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse" />
              高安全级别
            </span>
          </div>

          <div className="space-y-8 flex-1 font-label text-xs">
            {/* Old Password updater */}
            <div className="space-y-3">
              <h4 className="font-body font-semibold text-on-surface text-sm">登录密码管理</h4>
              <p className="font-body text-xs text-on-surface-variant leading-relaxed">
                建议您建立强密码并每季度更新一次此安全凭证。上次安全周期维护：45 天前。
              </p>
              <button 
                onClick={() => {
                  setOldPassword('');
                  setNewPassword('');
                  setShowPasswordModal(true);
                }}
                className="font-semibold text-primary border border-primary/20 hover:bg-primary/5 px-5 py-2.5 rounded-xl transition-colors duration-200 w-full mt-2 cursor-pointer text-center"
              >
                修改网络密码
              </button>
            </div>

            <hr className="border-t border-outline-variant/15" />

            {/* Google Identity Integration */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="text-primary w-4.5 h-4.5 animate-pulse" />
                <h4 className="font-body font-semibold text-on-surface text-sm">Google 联合登录授权</h4>
              </div>

              {profile.email.includes('@gmail.com') || profile.deptAndTitle.includes('Google') ? (
                <div className="bg-surface p-4 rounded-2xl flex flex-col gap-3 border border-outline-variant/15">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#EA4335]/15 text-[#EA4335] flex items-center justify-center font-black text-sm select-none">
                        G
                      </div>
                      <div>
                        <p className="font-body text-xs font-semibold text-on-surface">已通过 Google 安全联制</p>
                        <p className="font-body text-[10px] text-on-surface-variant font-mono break-all">{profile.email}</p>
                      </div>
                    </div>
                    
                    <span className="text-[10px] bg-green-50 text-green-700 px-2 py-0.5 rounded-full font-bold">ONLINE</span>
                  </div>
                  
                  <button 
                    onClick={handleGoogleLogin}
                    className="font-semibold text-xs text-primary border border-primary/10 hover:bg-primary/5 px-4 py-2 rounded-xl transition-all cursor-pointer text-center w-full"
                  >
                    切换其它 Google 账号
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="font-body text-xs text-on-surface-variant leading-relaxed">
                    将您的系统操作账号与安全的 Google 联合身份进行同步，一键拉取画像头像。 
                  </p>
                  
                  <button 
                    onClick={handleGoogleLogin}
                    className="flex items-center justify-center gap-2.5 bg-[#4285F4] hover:bg-[#4285F4]/95 text-white font-body font-semibold text-xs px-5 py-3 rounded-xl transition-all w-full cursor-pointer shadow-sm hover:shadow-md"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="currentColor"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="currentColor" opacity="0.9"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z" fill="currentColor" opacity="0.8"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z" fill="currentColor" opacity="0.95"/>
                    </svg>
                    <span>使用 Google 账号登录</span>
                  </button>
                </div>
              )}

              {/* Developer Configuration Redirect URI */}
              <div className="bg-surface p-3.5 rounded-2xl border border-outline-variant/10 space-y-2">
                <div className="flex items-center gap-1.5 text-on-surface-variant font-semibold text-[10px] uppercase tracking-wider">
                  <Globe className="w-3.5 h-3.5 text-primary" />
                  <span>Google Cloud 回调重定向地址</span>
                </div>
                <p className="text-[10px] text-on-surface-variant leading-relaxed">
                  添加至 Google Console 的 Authorized Redirect URIs
                </p>
                <div className="flex items-center gap-1.5 mt-1 bg-surface-container-low p-2 rounded-lg border border-outline-variant/5">
                  <span className="font-mono text-[9px] text-on-surface truncate flex-1 select-all select-none">
                    {typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : '/auth/callback'}
                  </span>
                  <button 
                    onClick={() => copyToClipboard(typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : '/auth/callback')}
                    className="p-1 hover:bg-surface-container rounded transition-colors text-primary cursor-pointer shrink-0"
                    title="复制回调 URI"
                  >
                    {copiedRedirectUri ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
              </div>
            </div>

            <hr className="border-t border-outline-variant/15" />

            {/* 2FA dynamic verification */}
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h4 className="font-body font-semibold text-on-surface text-sm">双因素认证 (2FA)</h4>
                  <p className="font-body text-xs text-on-surface-variant leading-relaxed">
                    在登陆大底座环境时需要提供设备绑定的六位验证码协助验证。
                  </p>
                </div>
                
                {/* Slide checkbox toggle */}
                <button 
                  type="button"
                  onClick={handleToggle2FA}
                  className={`w-11 h-6 rounded-full relative transition-colors duration-300 cursor-pointer ${
                    profile.twoFactorEnabled ? 'bg-primary' : 'bg-surface-container-highest'
                  }`}
                  title="双因素开关"
                >
                  <span className={`w-4.5 h-4.5 rounded-full bg-white absolute top-0.5 shadow transition-all duration-300 ${
                    profile.twoFactorEnabled ? 'left-5.5' : 'left-0.5'
                  }`} />
                </button>
              </div>

              {/* Bound parameters mapping */}
              {profile.boundDevice ? (
                <div className="bg-surface p-4 rounded-xl flex items-center justify-between border border-outline-variant/15">
                  <div className="flex items-center gap-3">
                    <Smartphone className="w-5 h-5 text-primary shrink-0" />
                    <div>
                      <p className="font-body text-xs font-semibold text-on-surface">已绑定智能验证终端</p>
                      <p className="font-body text-[10px] text-on-surface-variant">{profile.boundDevice.name} · {profile.boundDevice.location}</p>
                    </div>
                  </div>
                  
                  <button 
                    onClick={handleSeverDevice}
                    className="text-on-surface-variant hover:text-error transition-colors p-1.5"
                    title="注销绑定密钥设备"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="bg-surface p-4 rounded-xl border border-dashed border-outline-variant/30 text-center py-5">
                  <p className="text-on-surface-variant text-[11px] mb-1">暂无绑定的多因素验证设备</p>
                  <button 
                    onClick={() => {
                      onUpdateProfile({
                        ...profile,
                        boundDevice: { name: 'iPhone 14 Pro', location: '杭州' }
                      });
                      triggerFeedbackBanner('成功绑定当前登录终端。');
                    }}
                    className="text-primary hover:underline font-bold text-xs cursor-pointer"
                  >
                    绑定当前登录手机
                  </button>
                </div>
              )}
            </div>

          </div>
        </section>

        {/* Data integration Section Spans 2 cols */}
        <section className="lg:col-span-2 bg-surface rounded-[2rem] p-8 lg:p-10 border border-outline-variant/10 relative text-left">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Database className="text-primary w-6 h-6 stroke-[2.2px]" />
              <h3 className="font-headline text-2xl font-medium text-on-surface">数据源集成管理</h3>
            </div>
            
            <button 
              onClick={() => {
                setConnName('');
                setConnUrl('postgresql://marai-admin:******@marai-db-instance:5432/main');
                setShowConnectorModal(true);
              }}
              className="text-primary font-label text-sm font-semibold hover:text-primary-container flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>新增数据源</span>
            </button>
          </div>

          <p className="font-body text-xs text-on-surface-variant mb-6 leading-relaxed">
            配置用于 MarAI 数字决策引擎的数据仓库连接凭证。您的主 MarAI 服务将实时对以下目标实施分布式知识抽取。
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dataSources.map((ds) => {
              const isConnected = ds.status === 'connected';
              return (
                <div 
                  key={ds.id}
                  onClick={() => handleUnconfiguredClick(ds)}
                  className={`p-5 rounded-2xl border transition-all flex flex-col justify-between min-h-[140px] ${
                    isConnected 
                      ? 'bg-surface border-outline-variant/15 hover:border-primary/20 hover:shadow-sm cursor-default' 
                      : 'bg-surface/60 border-dashed border-outline-variant/25 hover:border-primary/20 cursor-pointer'
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold ${
                      isConnected ? 'bg-primary/10 text-primary' : 'bg-surface-container-highest text-on-surface-variant'
                    }`}>
                      <Database className="w-4 h-4" />
                    </div>

                    {isConnected ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-label font-bold text-green-700 bg-green-50 px-2.5 py-0.5 rounded-full">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                        已同步
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-label font-bold text-on-surface-variant bg-surface-container px-2 py-0.5 rounded-full">
                        未配置
                      </span>
                    )}
                  </div>

                  <div>
                    <h4 className="font-headline font-semibold text-on-surface text-base">{ds.name}</h4>
                    <p className="font-label text-xs text-on-surface-variant mt-1">{ds.subtitle}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Notifications rules Spans 1 col */}
        <section className="lg:col-span-1 bg-surface rounded-[2rem] p-8 lg:p-10 border border-outline-variant/10 text-left">
          <div className="flex items-center gap-3 mb-8">
            <Bell className="text-primary w-6 h-6 stroke-[2.2px]" />
            <h3 className="font-headline text-2xl font-medium text-on-surface font-headline">通知设置</h3>
          </div>

          <div className="space-y-6 font-label text-xs">
            {/* Rule 1 (Forced alerts) */}
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <h4 className="font-body font-semibold text-on-surface text-sm">系统级警报</h4>
                <p className="font-body text-xs text-on-surface-variant leading-relaxed">
                  大底座密钥失效或有降权恶意阻断（安全体系强制）。
                </p>
              </div>
              
              <button 
                type="button"
                disabled
                className="w-9 h-5 rounded-full relative bg-primary/40 cursor-not-allowed shrink-0"
                title="系统警报"
              >
                <span className="w-4 h-4 rounded-full bg-white absolute top-0.5 left-4.5 shadow" />
              </button>
            </div>

            <hr className="border-t border-outline-variant/10" />

            {/* Rule 2 (Daily recap) */}
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <h4 className="font-body font-semibold text-on-surface text-sm">每日数据摘要</h4>
                <p className="font-body text-xs text-on-surface-variant leading-relaxed">
                  通过 MarAI 决策内参发送每日关注文献的分析矩阵。
                </p>
              </div>
              
              <button 
                type="button"
                onClick={() => {
                  onUpdateProfile({
                    ...profile,
                    notifications: { ...profile.notifications, dailyDigest: !profile.notifications.dailyDigest }
                  });
                  triggerFeedbackBanner(profile.notifications.dailyDigest ? '开启每日分析数据邮包推送。' : '取消每日邮包推送。');
                }}
                className={`w-9 h-5 rounded-full relative transition-colors cursor-pointer shrink-0 ${
                  profile.notifications.dailyDigest ? 'bg-primary' : 'bg-surface-container-highest'
                }`}
                title="每日摘要开关"
              >
                <span className={`w-4 h-4 rounded-full bg-white absolute top-0.5 shadow transition-all ${
                  profile.notifications.dailyDigest ? 'left-4.5' : 'left-0.5'
                }`} />
              </button>
            </div>

            <hr className="border-t border-outline-variant/10" />

            {/* Rule 3 (Team Activity) */}
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <h4 className="font-body font-semibold text-on-surface text-sm">团队协助动态</h4>
                <p className="font-body text-xs text-on-surface-variant leading-relaxed">
                  同事提及、批注文献报告、或被分配新权限凭证。
                </p>
              </div>
              
              <button 
                type="button"
                onClick={() => {
                  onUpdateProfile({
                    ...profile,
                    notifications: { ...profile.notifications, teamActivity: !profile.notifications.teamActivity }
                  });
                  triggerFeedbackBanner(profile.notifications.teamActivity ? '开启协同人员动态通知监控。' : '协同人员通知已设为免打扰。');
                }}
                className={`w-9 h-5 rounded-full relative transition-colors cursor-pointer shrink-0 ${
                  profile.notifications.teamActivity ? 'bg-primary' : 'bg-surface-container-highest'
                }`}
                title="协作开关"
              >
                <span className={`w-4 h-4 rounded-full bg-white absolute top-0.5 shadow transition-all ${
                  profile.notifications.teamActivity ? 'left-4.5' : 'left-0.5'
                }`} />
              </button>
            </div>
          </div>
        </section>

      </div>

      {/* Password Update Modal Dialog */}
      <AnimatePresence>
        {showPasswordModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-surface rounded-3xl p-6 md:p-8 max-w-sm w-full shadow-2xl border border-outline-variant/15 text-left space-y-6"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2 text-primary">
                  <Key className="w-5 h-5" />
                  <h3 className="font-headline text-lg font-bold">更新主登录密码凭证</h3>
                </div>
                <button 
                  onClick={() => setShowPasswordModal(false)}
                  className="rounded-full p-1 hover:bg-surface-container-high cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!newPassword) return;
                  setShowPasswordModal(false);
                  triggerFeedbackBanner('账户安全证书密码更新成功，策略已分发！');
                }}
                className="space-y-4 font-label text-xs"
              >
                <div className="space-y-1">
                  <label className="text-on-surface-variant font-semibold">历史旧密码</label>
                  <input 
                    type="password"
                    required
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder="请输入当前密码"
                    className="w-full bg-surface-container-low p-3 rounded-xl border border-outline-variant/20 focus:border-primary outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-on-surface-variant font-semibold">生成新高强度密码</label>
                  <input 
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="推荐大于8位的大小写英文与符号"
                    className="w-full bg-surface-container-low p-3 rounded-xl border border-outline-variant/20 focus:border-primary outline-none"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-3 text-sm">
                  <button 
                    type="button"
                    onClick={() => setShowPasswordModal(false)}
                    className="px-4 py-2 hover:bg-surface-container text-on-surface-variant rounded-xl cursor-pointer"
                  >
                    取消
                  </button>
                  <button 
                    type="submit"
                    className="px-6 py-2 bg-primary text-white font-semibold rounded-xl hover:opacity-90 transition-all cursor-pointer shadow"
                  >
                    确认重设
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Database Setup Connection Modal Dialog */}
      <AnimatePresence>
        {showConnectorModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-surface rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-outline-variant/15 text-left space-y-6"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2.5 text-primary">
                  <Database className="w-5.5 h-5.5" />
                  <h3 className="font-headline text-lg font-bold">配置全新大底座连接</h3>
                </div>
                <button 
                  onClick={() => setShowConnectorModal(false)}
                  className="rounded-full p-1 hover:bg-surface-container-high cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleConnectorSubmit} className="space-y-5 font-label text-xs">
                
                {/* DB Type select option */}
                <div className="space-y-1.5">
                  <label className="font-semibold text-on-surface-variant uppercase tracking-wider block">选择数据库驱动种类</label>
                  <div className="grid grid-cols-3 gap-3">
                    {(['postgresql', 'mysql', 'mongodb'] as const).map((t) => {
                      const isAct = connType === t;
                      return (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setConnType(t)}
                          className={`p-3 rounded-xl border text-center transition-all cursor-pointer font-semibold uppercase ${
                            isAct 
                              ? 'bg-primary/5 border-primary text-primary font-boldScale'
                              : 'bg-transparent border-outline-variant/20 text-on-surface-variant hover:bg-surface-container-low'
                          }`}
                        >
                          {t === 'postgresql' ? 'PG' : t === 'mysql' ? 'MySQL' : 'Mongo'}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Connection Name */}
                <div className="space-y-1.5">
                  <label className="font-semibold text-on-surface-variant uppercase tracking-wider block">数据源命名</label>
                  <input 
                    type="text"
                    required
                    value={connName}
                    onChange={(e) => setConnName(e.target.value)}
                    placeholder="例如: PostgreSQL (业务主库)"
                    className="w-full bg-surface-container-low p-3 rounded-xl border border-outline-variant/20 focus:border-primary outline-none"
                  />
                </div>

                {/* Connection URL string */}
                <div className="space-y-1.5">
                  <label className="font-semibold text-on-surface-variant uppercase tracking-wider block">主实例连接字符串 (URL / Socket URI)</label>
                  <input 
                    type="text"
                    required
                    value={connUrl}
                    onChange={(e) => setConnUrl(e.target.value)}
                    placeholder="postgresql://user:pass@host:port/dbname"
                    className="w-full bg-surface-container-low p-3 rounded-xl border border-outline-variant/20 focus:border-primary outline-none font-mono text-xs"
                  />
                </div>

                <div className="p-3 bg-primary-container/10 text-primary rounded-xl leading-relaxed text-[11px] font-medium flex items-start gap-2">
                  <Lock className="w-4 h-4 text-primary shrink-0 mt-0.5" strokeWidth={2.5} />
                  <span>
                    您的敏感数据库账号口令将经过加密后存放在 Cloud Key Vault。MarAI 分析引擎在执行任务时，仅进行临时沙盒级链接交互。
                  </span>
                </div>

                <div className="pt-2 flex justify-end gap-3 text-sm">
                  <button 
                    type="button"
                    onClick={() => setShowConnectorModal(false)}
                    className="px-4 py-2 hover:bg-surface-container text-on-surface-variant rounded-xl cursor-pointer"
                  >
                    取消
                  </button>
                  <button 
                    type="submit"
                    className="px-6 py-2 bg-primary text-white font-semibold rounded-xl hover:opacity-90 shadow transition-all cursor-pointer"
                  >
                    连接至 MarAI 决策流
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Google Login Sandbox Customization Modal Dialog */}
      <AnimatePresence>
        {showGoogleSandboxModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-surface rounded-3xl p-6 md:p-8 max-w-xl w-full shadow-2xl border border-outline-variant/15 text-left space-y-6"
            >
              {/* Header */}
              <div className="flex justify-between items-start border-b border-outline-variant/10 pb-4">
                <div className="flex items-center gap-3 text-primary">
                  <div className="w-9 h-9 rounded-full bg-[#4285F4]/10 text-[#4285F4] flex items-center justify-center font-black text-sm select-none">G</div>
                  <div>
                    <h3 className="font-headline text-lg font-bold text-on-surface">Google 登录沙盒联机调试中心</h3>
                    <p className="text-on-surface-variant text-[11px] mt-0.5">检测到未配置 GOOGLE_CLIENT_ID 环境变量，启用高真仿真联接</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowGoogleSandboxModal(false)}
                  className="rounded-full p-1 hover:bg-surface-container-high transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-5 text-xs">
                {/* Developer Guidelines Card */}
                <div className="p-4 bg-primary-container/10 border border-primary-container/20 rounded-2xl relative overflow-hidden">
                  <Sparkles className="absolute -right-6 -bottom-6 w-24 h-24 text-primary/5 pointer-events-none" />
                  <p className="font-semibold text-primary mb-1">💡 联机正式部署指南：</p>
                  <ol className="list-decimal pl-4 space-y-1 text-on-surface-variant leading-relaxed text-[11px]">
                    <li>在 AI Studio 的 Secrets 管理面板内配置 <code>GOOGLE_CLIENT_ID</code> 与 <code>GOOGLE_CLIENT_SECRET</code>。</li>
                    <li>在 Google Cloud Console 中，将上方复制的回调重定向 URI 登记至您的 Authorized Redirect URIs。</li>
                    <li>再次点击「使用 Google 账号登录」即将彻底唤醒无缝的 Google Identity Cloud 登录授权弹出流。</li>
                  </ol>
                </div>

                {/* Preconfigured Google Accounts Selector */}
                <div className="space-y-2">
                  <p className="font-bold text-on-surface uppercase tracking-wider block text-[10px]">方案 A：选择仿真 Google 专家账号登录体验（推荐）</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {defaultMockGoogleAccounts.map((acc, idx) => (
                      <div 
                        key={idx}
                        onClick={() => {
                          setMockGoogleName(acc.name);
                          setMockGoogleEmail(acc.email);
                          setMockGoogleAvatar(acc.avatar);
                        }}
                        className={`p-3 rounded-xl border flex items-center gap-2.5 cursor-pointer transition-all ${
                          mockGoogleName === acc.name && mockGoogleEmail === acc.email
                            ? 'bg-primary/5 border-primary shadow-sm'
                            : 'bg-transparent border-outline-variant/15 hover:bg-surface-container-low'
                        }`}
                      >
                        <img src={acc.avatar} className="w-8 h-8 rounded-full object-cover border border-outline-variant/10 shrink-0" />
                        <div className="truncate flex-1">
                          <p className="font-semibold text-on-surface text-[11px] truncate flex items-center gap-1">
                            <span>{acc.name}</span>
                            {mockGoogleName === acc.name && <span className="text-[9px] bg-primary text-white scale-90 px-1 rounded">选中</span>}
                          </p>
                          <p className="text-[9px] text-on-surface-variant font-mono truncate">{acc.email}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Custom account configuration form */}
                <div className="space-y-3 pt-3 border-t border-outline-variant/10">
                  <p className="font-bold text-on-surface uppercase tracking-wider block text-[10px]">方案 B：输入自定义 Google 画像以进行精确同步</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="space-y-1">
                      <label className="text-on-surface-variant font-semibold">姓/全名</label>
                      <input 
                        type="text"
                        value={mockGoogleName}
                        onChange={(e) => setMockGoogleName(e.target.value)}
                        placeholder="唐若雪"
                        className="w-full bg-surface-container-low p-2.5 rounded-xl border border-outline-variant/20 focus:border-primary outline-none text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-on-surface-variant font-semibold">Google 关联邮箱 (需为 Gmail/G Suite 开头)</label>
                      <input 
                        type="email"
                        value={mockGoogleEmail}
                        onChange={(e) => setMockGoogleEmail(e.target.value)}
                        placeholder="ruoxue.tang@gmail.com"
                        className="w-full bg-surface-container-low p-2.5 rounded-xl border border-outline-variant/20 focus:border-primary outline-none font-mono text-xs"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Action operations footer */}
              <div className="pt-4 border-t border-outline-variant/10 flex justify-end gap-3 text-sm font-label">
                <button 
                  onClick={() => setShowGoogleSandboxModal(false)}
                  className="px-4 py-2 hover:bg-surface-container text-on-surface-variant rounded-xl cursor-pointer"
                >
                  取消
                </button>
                <button 
                  onClick={() => {
                    const matchedAcc = defaultMockGoogleAccounts.find(x => x.name === mockGoogleName);
                    const finalDept = matchedAcc ? matchedAcc.dept : 'Google 认证特邀技术专家';
                    handleCompleteSandboxLogin(mockGoogleName, mockGoogleEmail, mockGoogleAvatar, finalDept);
                  }}
                  className="px-6 py-2.5 bg-[#4285F4] text-white font-semibold rounded-xl hover:bg-[#4285F4]/90 shadow transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  </svg>
                  <span>极速注入模拟 Google 联机登录</span>
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
