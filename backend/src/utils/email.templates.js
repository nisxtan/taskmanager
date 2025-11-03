const taskCreatedTemplate = (username, taskTitle, taskDescription) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 20px auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #14b8a6, #0d9488); color: white; padding: 30px; text-align: center; }
        .content { padding: 30px; }
        .task-box { background: #f0fdfa; border-left: 4px solid #14b8a6; padding: 15px; margin: 20px 0; border-radius: 5px; }
        .task-title { font-size: 18px; font-weight: bold; color: #0f766e; margin-bottom: 8px; }
        .task-desc { color: #64748b; font-size: 14px; line-height: 1.6; }
        .footer { background: #f8fafc; padding: 20px; text-align: center; color: #64748b; font-size: 12px; }
        .emoji { font-size: 40px; margin-bottom: 10px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="emoji">✅</div>
          <h1 style="margin: 0;">Task Created Successfully!</h1>
        </div>
        <div class="content">
          <p>Hi <strong>${username}</strong>,</p>
          <p>You have successfully created a new task:</p>
          
          <div class="task-box">
            <div class="task-title">📝 ${taskTitle}</div>
            ${
              taskDescription
                ? `<div class="task-desc">${taskDescription}</div>`
                : ""
            }
          </div>
          
          <p>Keep up the great work! 🚀</p>
        </div>
        <div class="footer">
          <p>This is an automated message from Task Manager</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

const taskUpdatedTemplate = (username, taskTitle, taskDescription) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 20px auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #f59e0b, #d97706); color: white; padding: 30px; text-align: center; }
        .content { padding: 30px; }
        .task-box { background: #fffbeb; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 5px; }
        .task-title { font-size: 18px; font-weight: bold; color: #92400e; margin-bottom: 8px; }
        .task-desc { color: #64748b; font-size: 14px; line-height: 1.6; }
        .footer { background: #f8fafc; padding: 20px; text-align: center; color: #64748b; font-size: 12px; }
        .emoji { font-size: 40px; margin-bottom: 10px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="emoji">✏️</div>
          <h1 style="margin: 0;">Task Updated Successfully!</h1>
        </div>
        <div class="content">
          <p>Hi <strong>${username}</strong>,</p>
          <p>You have successfully updated your task:</p>
          
          <div class="task-box">
            <div class="task-title">📝 ${taskTitle}</div>
            ${
              taskDescription
                ? `<div class="task-desc">${taskDescription}</div>`
                : ""
            }
          </div>
          
          <p>Your changes have been saved! ✨</p>
        </div>
        <div class="footer">
          <p>This is an automated message from Task Manager</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

const taskDeletedTemplate = (username, taskTitle) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 20px auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #ef4444, #dc2626); color: white; padding: 30px; text-align: center; }
        .content { padding: 30px; }
        .task-box { background: #fef2f2; border-left: 4px solid #ef4444; padding: 15px; margin: 20px 0; border-radius: 5px; }
        .task-title { font-size: 18px; font-weight: bold; color: #991b1b; margin-bottom: 8px; }
        .footer { background: #f8fafc; padding: 20px; text-align: center; color: #64748b; font-size: 12px; }
        .emoji { font-size: 40px; margin-bottom: 10px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="emoji">🗑️</div>
          <h1 style="margin: 0;">Task Deleted Successfully!</h1>
        </div>
        <div class="content">
          <p>Hi <strong>${username}</strong>,</p>
          <p>You have successfully deleted the following task:</p>
          
          <div class="task-box">
            <div class="task-title">📝 ${taskTitle}</div>
          </div>
          
          <p>The task has been permanently removed. 🗑️</p>
        </div>
        <div class="footer">
          <p>This is an automated message from Task Manager</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

module.exports = {
  taskCreatedTemplate,
  taskUpdatedTemplate,
  taskDeletedTemplate,
};
