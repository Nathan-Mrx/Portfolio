<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260110210958 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE article ADD thumbnail_url VARCHAR(255) DEFAULT NULL');
        $this->addSql('ALTER TABLE article ADD cover_url VARCHAR(255) DEFAULT NULL');
        $this->addSql('ALTER TABLE article ADD content_blocks JSON DEFAULT NULL');
        $this->addSql('ALTER TABLE project ADD thumbnail_url VARCHAR(255) DEFAULT NULL');
        $this->addSql('ALTER TABLE project ADD cover_url VARCHAR(255) DEFAULT NULL');
        $this->addSql('ALTER TABLE project ADD content_blocks JSON DEFAULT NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE article DROP thumbnail_url');
        $this->addSql('ALTER TABLE article DROP cover_url');
        $this->addSql('ALTER TABLE article DROP content_blocks');
        $this->addSql('ALTER TABLE project DROP thumbnail_url');
        $this->addSql('ALTER TABLE project DROP cover_url');
        $this->addSql('ALTER TABLE project DROP content_blocks');
    }
}
