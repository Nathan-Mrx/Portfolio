<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20260501000001 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Add position and featured fields to project and article tables';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE project ADD position INT DEFAULT NULL');
        $this->addSql('ALTER TABLE project ADD featured BOOLEAN NOT NULL DEFAULT false');
        $this->addSql('ALTER TABLE article ADD position INT DEFAULT NULL');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE project DROP position');
        $this->addSql('ALTER TABLE project DROP featured');
        $this->addSql('ALTER TABLE article DROP position');
    }
}
