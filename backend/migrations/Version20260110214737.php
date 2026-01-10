<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260110214737 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE article_related_articles (article_source INT NOT NULL, article_target INT NOT NULL, PRIMARY KEY (article_source, article_target))');
        $this->addSql('CREATE INDEX IDX_E0A04B6354DE8F3 ON article_related_articles (article_source)');
        $this->addSql('CREATE INDEX IDX_E0A04B62CA8B87C ON article_related_articles (article_target)');
        $this->addSql('CREATE TABLE project_related_projects (project_source INT NOT NULL, project_target INT NOT NULL, PRIMARY KEY (project_source, project_target))');
        $this->addSql('CREATE INDEX IDX_47953E60482E9439 ON project_related_projects (project_source)');
        $this->addSql('CREATE INDEX IDX_47953E6051CBC4B6 ON project_related_projects (project_target)');
        $this->addSql('ALTER TABLE article_related_articles ADD CONSTRAINT FK_E0A04B6354DE8F3 FOREIGN KEY (article_source) REFERENCES article (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE article_related_articles ADD CONSTRAINT FK_E0A04B62CA8B87C FOREIGN KEY (article_target) REFERENCES article (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE project_related_projects ADD CONSTRAINT FK_47953E60482E9439 FOREIGN KEY (project_source) REFERENCES project (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE project_related_projects ADD CONSTRAINT FK_47953E6051CBC4B6 FOREIGN KEY (project_target) REFERENCES project (id) ON DELETE CASCADE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE article_related_articles DROP CONSTRAINT FK_E0A04B6354DE8F3');
        $this->addSql('ALTER TABLE article_related_articles DROP CONSTRAINT FK_E0A04B62CA8B87C');
        $this->addSql('ALTER TABLE project_related_projects DROP CONSTRAINT FK_47953E60482E9439');
        $this->addSql('ALTER TABLE project_related_projects DROP CONSTRAINT FK_47953E6051CBC4B6');
        $this->addSql('DROP TABLE article_related_articles');
        $this->addSql('DROP TABLE project_related_projects');
    }
}
