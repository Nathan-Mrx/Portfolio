<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Put;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;

#[ORM\Entity]
#[ApiResource(
    normalizationContext: ['groups' => ['profile:read']],
    denormalizationContext: ['groups' => ['profile:write']],
    operations: [
        new Get(),
        new GetCollection(),
        new Post(security: "is_granted('ROLE_ADMIN')"),
        new Patch(security: "is_granted('ROLE_ADMIN')"),
        new Put(security: "is_granted('ROLE_ADMIN')")
    ]
)]
class Profile
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['profile:read'])]
    private ?int $id = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    #[Groups(['profile:read', 'profile:write'])]
    private ?string $aboutEn = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    #[Groups(['profile:read', 'profile:write'])]
    private ?string $aboutFr = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['profile:read', 'profile:write'])]
    private ?string $email = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['profile:read', 'profile:write'])]
    private ?string $phone = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['profile:read', 'profile:write'])]
    private ?string $jobTitleEn = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['profile:read', 'profile:write'])]
    private ?string $jobTitleFr = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['profile:read', 'profile:write'])]
    private ?string $availabilityStatus = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    #[Groups(['profile:read', 'profile:write'])]
    private ?string $resumeBioEn = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    #[Groups(['profile:read', 'profile:write'])]
    private ?string $resumeBioFr = null;

    #[ORM\Column(type: Types::JSON, nullable: true)]
    #[Groups(['profile:read', 'profile:write'])]
    private ?array $resumeData = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['profile:read', 'profile:write'])]
    private ?string $profileImageUrl = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['profile:read', 'profile:write'])]
    private ?string $location = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getAboutEn(): ?string
    {
        return $this->aboutEn;
    }

    public function setAboutEn(?string $aboutEn): self
    {
        $this->aboutEn = $aboutEn;
        return $this;
    }

    public function getAboutFr(): ?string
    {
        return $this->aboutFr;
    }

    public function setAboutFr(?string $aboutFr): self
    {
        $this->aboutFr = $aboutFr;
        return $this;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(?string $email): self
    {
        $this->email = $email;
        return $this;
    }

    public function getPhone(): ?string
    {
        return $this->phone;
    }

    public function setPhone(?string $phone): self
    {
        $this->phone = $phone;
        return $this;
    }

    public function getJobTitleEn(): ?string
    {
        return $this->jobTitleEn;
    }

    public function setJobTitleEn(?string $jobTitleEn): self
    {
        $this->jobTitleEn = $jobTitleEn;
        return $this;
    }

    public function getJobTitleFr(): ?string
    {
        return $this->jobTitleFr;
    }

    public function setJobTitleFr(?string $jobTitleFr): self
    {
        $this->jobTitleFr = $jobTitleFr;
        return $this;
    }

    public function getAvailabilityStatus(): ?string
    {
        return $this->availabilityStatus;
    }

    public function setAvailabilityStatus(?string $availabilityStatus): self
    {
        $this->availabilityStatus = $availabilityStatus;
        return $this;
    }

    public function getResumeBioEn(): ?string
    {
        return $this->resumeBioEn;
    }

    public function setResumeBioEn(?string $resumeBioEn): self
    {
        $this->resumeBioEn = $resumeBioEn;
        return $this;
    }

    public function getResumeBioFr(): ?string
    {
        return $this->resumeBioFr;
    }

    public function setResumeBioFr(?string $resumeBioFr): self
    {
        $this->resumeBioFr = $resumeBioFr;
        return $this;
    }

    public function getResumeData(): ?array
    {
        return $this->resumeData;
    }

    public function setResumeData(?array $resumeData): self
    {
        $this->resumeData = $resumeData;
        return $this;
    }

    public function getProfileImageUrl(): ?string
    {
        return $this->profileImageUrl;
    }

    public function setProfileImageUrl(?string $profileImageUrl): self
    {
        $this->profileImageUrl = $profileImageUrl;
        return $this;
    }

    public function getLocation(): ?string
    {
        return $this->location;
    }

    public function setLocation(?string $location): self
    {
        $this->location = $location;
        return $this;
    }
}
