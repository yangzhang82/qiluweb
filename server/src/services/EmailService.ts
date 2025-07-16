export class EmailService {
  private smtpConfig = {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || ''
  };

  // 发送邮件的基础方法
  private async sendMail(to: string, subject: string, html: string): Promise<boolean> {
    try {
      // 这里应该集成真实的邮件服务，如nodemailer
      console.log(`发送邮件到: ${to}`);
      console.log(`主题: ${subject}`);
      console.log(`内容: ${html}`);
      
      // 模拟发送成功
      return true;
    } catch (error) {
      console.error('邮件发送失败:', error);
      return false;
    }
  }

  // 发送欢迎邮件
  async sendWelcomeEmail(to: string, username: string): Promise<boolean> {
    const subject = '欢迎加入齐鲁国际学校';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2c5aa0;">欢迎加入齐鲁国际学校！</h2>
        <p>亲爱的 ${username}，</p>
        <p>欢迎您注册成为齐鲁国际学校的用户！我们很高兴您选择了我们的教育平台。</p>
        <p>在这里，您可以：</p>
        <ul>
          <li>浏览最新的校园新闻和活动</li>
          <li>了解我们的课程设置和师资力量</li>
          <li>参与在线学习和交流</li>
          <li>获取个性化的学习建议</li>
        </ul>
        <p>如果您有任何问题，请随时联系我们：</p>
        <p>电话：400-123-4567<br>邮箱：info@qilu.edu.cn</p>
        <p>祝您学习愉快！</p>
        <p>齐鲁国际学校团队</p>
      </div>
    `;
    
    return await this.sendMail(to, subject, html);
  }

  // 发送报名确认邮件
  async sendEnrollmentConfirmation(to: string, studentName: string, enrollmentId: number): Promise<boolean> {
    const subject = '报名申请确认 - 齐鲁国际学校';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2c5aa0;">报名申请确认</h2>
        <p>亲爱的家长，</p>
        <p>我们已收到您为 ${studentName} 提交的入学申请（申请编号：${enrollmentId}）。</p>
        <p>我们的招生办公室将在3个工作日内审核您的申请，并通过邮件或电话与您联系。</p>
        <p>在等待期间，如有任何疑问，请联系我们：</p>
        <p>招生热线：400-123-4567<br>招生邮箱：admission@qilu.edu.cn</p>
        <p>感谢您对齐鲁国际学校的信任！</p>
        <p>齐鲁国际学校招生办</p>
      </div>
    `;
    
    return await this.sendMail(to, subject, html);
  }

  // 发送报名审核结果邮件
  async sendEnrollmentResult(to: string, studentName: string, approved: boolean): Promise<boolean> {
    const subject = approved ? '报名申请通过 - 齐鲁国际学校' : '报名申请结果 - 齐鲁国际学校';
    const html = approved ? `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #28a745;">恭喜！报名申请通过</h2>
        <p>亲爱的家长，</p>
        <p>恭喜您！${studentName} 的入学申请已通过审核。</p>
        <p>请在收到此邮件后的7个工作日内：</p>
        <ol>
          <li>携带相关证件到学校办理入学手续</li>
          <li>缴纳学费和相关费用</li>
          <li>领取学生证和相关资料</li>
        </ol>
        <p>办理地址：山东省济南市历下区齐鲁国际学校招生办<br>
        办理时间：周一至周五 9:00-17:00</p>
        <p>联系电话：400-123-4567</p>
        <p>我们期待 ${studentName} 的到来！</p>
        <p>齐鲁国际学校招生办</p>
      </div>
    ` : `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc3545;">报名申请结果通知</h2>
        <p>亲爱的家长，</p>
        <p>感谢您对齐鲁国际学校的关注和信任。</p>
        <p>经过仔细审核，很遗憾地通知您，${studentName} 的入学申请暂时未能通过。</p>
        <p>这并不意味着 ${studentName} 不够优秀，而是由于名额限制等因素。</p>
        <p>我们建议您：</p>
        <ul>
          <li>关注我们的后续招生信息</li>
          <li>参加我们的开放日活动</li>
          <li>咨询其他适合的课程或项目</li>
        </ul>
        <p>如有疑问，请联系我们：400-123-4567</p>
        <p>齐鲁国际学校招生办</p>
      </div>
    `;
    
    return await this.sendMail(to, subject, html);
  }

  // 发送密码重置邮件
  async sendPasswordReset(to: string, resetToken: string): Promise<boolean> {
    const subject = '密码重置 - 齐鲁国际学校';
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2c5aa0;">密码重置请求</h2>
        <p>您好，</p>
        <p>我们收到了您的密码重置请求。请点击下面的链接重置您的密码：</p>
        <p style="margin: 20px 0;">
          <a href="${resetUrl}" style="background-color: #2c5aa0; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">重置密码</a>
        </p>
        <p>此链接将在24小时后失效。如果您没有请求重置密码，请忽略此邮件。</p>
        <p>如有疑问，请联系我们：info@qilu.edu.cn</p>
        <p>齐鲁国际学校技术团队</p>
      </div>
    `;
    
    return await this.sendMail(to, subject, html);
  }

  // 发送简历收到确认邮件
  async sendResumeConfirmation(to: string, applicantName: string, position: string): Promise<boolean> {
    const subject = '简历收到确认 - 齐鲁国际学校';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2c5aa0;">简历收到确认</h2>
        <p>亲爱的 ${applicantName}，</p>
        <p>感谢您对齐鲁国际学校的关注！我们已收到您应聘"${position}"职位的简历。</p>
        <p>我们的人力资源部门将在5个工作日内审核您的简历，如果您的背景符合我们的要求，我们会及时与您联系安排面试。</p>
        <p>在等待期间，您可以：</p>
        <ul>
          <li>关注我们的官方网站了解更多学校信息</li>
          <li>准备可能的面试环节</li>
          <li>如有疑问，随时联系我们</li>
        </ul>
        <p>联系方式：<br>
        人事部电话：400-123-4567<br>
        邮箱：hr@qilu.edu.cn</p>
        <p>再次感谢您的关注！</p>
        <p>齐鲁国际学校人力资源部</p>
      </div>
    `;
    
    return await this.sendMail(to, subject, html);
  }
}
