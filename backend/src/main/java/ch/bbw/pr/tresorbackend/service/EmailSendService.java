package ch.bbw.pr.tresorbackend.service;

import com.sendgrid.Method;
import com.sendgrid.Request;
import com.sendgrid.Response;
import com.sendgrid.SendGrid;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Content;
import com.sendgrid.helpers.mail.objects.Email;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
public class EmailSendService {
    private static final Logger logger = LoggerFactory.getLogger(EmailSendService.class);

    @Value("${sendgrid.api.key}")
    private String sendgridApiKey;

    @Value("${sendgrid.from.email}")
    private String fromEmail;

    public void sendEmail(String toEmail, String subject, String content, boolean isHtml) throws IOException {
        Email from = new Email(fromEmail);
        Email to = new Email(toEmail);
        Content emailContent = new Content(isHtml ? "text/html" : "text/plain", content);
        Mail mail = new Mail(from, subject, to, emailContent);
        SendGrid sg = new SendGrid(sendgridApiKey);
        Request request = new Request();
        request.setMethod(Method.POST);
        request.setEndpoint("mail/send");
        request.setBody(mail.build());
        Response response = sg.api(request);
        if (response.getStatusCode() >= 400) {
            logger.error("Failed to send email to {}: {}", toEmail, response.getBody());
            throw new IOException("Failed to send email: " + response.getBody());
        }
    }
} 