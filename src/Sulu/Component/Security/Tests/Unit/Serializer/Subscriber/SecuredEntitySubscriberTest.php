<?php

/*
 * This file is part of Sulu.
 *
 * (c) Sulu GmbH
 *
 * This source file is subject to the MIT license that is bundled
 * with this source code in the file LICENSE.
 */

namespace Sulu\Component\Security\Tests\Unit\Serializer\Subscriber;

use JMS\Serializer\EventDispatcher\ObjectEvent;
use JMS\Serializer\Metadata\StaticPropertyMetadata;
use JMS\Serializer\Visitor\SerializationVisitorInterface;
use PHPUnit\Framework\TestCase;
use Prophecy\Argument;
use Sulu\Component\Rest\ApiWrapper;
use Sulu\Component\Security\Authentication\UserInterface;
use Sulu\Component\Security\Authorization\AccessControl\AccessControlManagerInterface;
use Sulu\Component\Security\Authorization\AccessControl\SecuredEntityInterface;
use Sulu\Component\Security\Serializer\Subscriber\SecuredEntitySubscriber;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;

class SecuredEntitySubscriberTest extends TestCase
{
    /**
     * @var SecuredEntitySubscriber
     */
    private $securedEntitySubscriber;

    /**
     * @var AccessControlManagerInterface
     */
    private $accessControlManager;

    /**
     * @var TokenStorageInterface
     */
    private $tokenStorage;

    /**
     * @var TokenInterface
     */
    private $token;

    /**
     * @var ObjectEvent
     */
    private $objectEvent;

    /**
     * @var UserInterface
     */
    private $user;

    /**
     * @var SerializationVisitorInterface
     */
    private $visitor;

    public function setUp(): void
    {
        $this->user = $this->prophesize(UserInterface::class);
        $this->token = $this->prophesize(TokenInterface::class);
        $this->token->getUser()->willReturn($this->user);

        $this->accessControlManager = $this->prophesize(AccessControlManagerInterface::class);
        $this->tokenStorage = $this->prophesize(TokenStorageInterface::class);
        $this->tokenStorage->getToken()->willReturn($this->token->reveal());
        $this->securedEntitySubscriber = new SecuredEntitySubscriber(
            $this->accessControlManager->reveal(),
            $this->tokenStorage->reveal()
        );

        $this->visitor = $this->prophesize(SerializationVisitorInterface::class);
        $this->objectEvent = $this->prophesize(ObjectEvent::class);
        $this->objectEvent->getVisitor()->willReturn($this->visitor);
    }

    public function testOnPostSerialize()
    {
        $entity = $this->prophesize(SecuredEntityInterface::class);
        $entity->getId()->willReturn(7);
        $entity->getSecurityContext()->willReturn('sulu.example');
        $this->objectEvent->getObject()->willReturn($entity);

        $permissions = [3 => ['view' => true]];
        $this->accessControlManager->getPermissions(\get_class($entity->reveal()), 7)->willReturn($permissions);

        $userPermission = ['_permissions' => ['permission' => 'value']];
        $this->accessControlManager->getUserPermissionByArray(null, 'sulu.example', $permissions, $this->user->reveal())
            ->willReturn($userPermission);

        $this->visitor->visitProperty(Argument::that(function(StaticPropertyMetadata $metadata) {
            return '_permissions' === $metadata->name;
        }), $userPermission)->shouldBeCalled();

        $this->visitor->visitProperty(Argument::that(function(StaticPropertyMetadata $metadata) {
            return '_hasPermissions' === $metadata->name;
        }), true)->shouldBeCalled();

        $this->securedEntitySubscriber->onPostSerialize($this->objectEvent->reveal());
    }

    public function testOnPostSerializeWithApiWrapper()
    {
        $apiWrapper = $this->prophesize(ApiWrapper::class);
        $entity = $this->prophesize(SecuredEntityInterface::class);
        $entity->getId()->willReturn(7);
        $entity->getSecurityContext()->willReturn('sulu.example');
        $apiWrapper->getEntity()->willReturn($entity);
        $this->objectEvent->getObject()->willReturn($apiWrapper);

        $permissions = [3 => ['view' => true]];
        $this->accessControlManager->getPermissions(\get_class($entity->reveal()), 7)->willReturn($permissions);

        $userPermission = ['_permissions' => ['permission' => 'value']];
        $this->accessControlManager->getUserPermissionByArray(null, 'sulu.example', $permissions, $this->user->reveal())
            ->willReturn($userPermission);

        $this->visitor->visitProperty(Argument::that(function(StaticPropertyMetadata $metadata) {
            return '_permissions' === $metadata->name;
        }), $userPermission)->shouldBeCalled();

        $this->visitor->visitProperty(Argument::that(function(StaticPropertyMetadata $metadata) {
            return '_hasPermissions' === $metadata->name;
        }), true)->shouldBeCalled();

        $this->securedEntitySubscriber->onPostSerialize($this->objectEvent->reveal());
    }
}
