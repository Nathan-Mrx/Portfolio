<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;
use Symfony\Component\Routing\Attribute\Route;

class ContactController extends AbstractController
{
    #[Route('/api/contact', name: 'contact', methods: ['POST'])]
    public function send(Request $request, MailerInterface $mailer): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $name = trim($data['name'] ?? '');
        $from = trim($data['email'] ?? '');
        $subject = trim($data['subject'] ?? '');
        $message = trim($data['message'] ?? '');

        if (!$name || !$from || !$subject || !$message) {
            return new JsonResponse(['error' => 'All fields are required.'], 400);
        }

        if (!filter_var($from, FILTER_VALIDATE_EMAIL)) {
            return new JsonResponse(['error' => 'Invalid email address.'], 400);
        }

        $to = $_ENV['CONTACT_EMAIL'] ?? 'contact@example.com';
        $sender = $_ENV['MAILER_FROM'] ?? $to;

        $email = (new Email())
            ->from($sender)
            ->replyTo($from)
            ->to($to)
            ->subject("[Portfolio Contact] $subject")
            ->text("From: $name <$from>\n\n$message");

        $mailer->send($email);

        return new JsonResponse(['success' => true]);
    }
}
