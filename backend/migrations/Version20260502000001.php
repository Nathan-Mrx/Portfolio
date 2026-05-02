<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20260502000001 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Add resume_highlights_en and resume_highlights_fr columns to project table';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE project ADD resume_highlights_en TEXT DEFAULT NULL');
        $this->addSql('ALTER TABLE project ADD resume_highlights_fr TEXT DEFAULT NULL');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE project DROP resume_highlights_en');
        $this->addSql('ALTER TABLE project DROP resume_highlights_fr');
    }
}
